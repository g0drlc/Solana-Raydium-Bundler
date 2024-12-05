import { connection, wallet, walletconn, tipAcct, payer } from "../config";
import { PublicKey, VersionedTransaction, TransactionInstruction, TransactionMessage, SystemProgram, Keypair, LAMPORTS_PER_SOL, AddressLookupTableAccount } from "@solana/web3.js";
import { DEFAULT_TOKEN, PROGRAMIDS } from "./clients/constants";
import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";
import { Liquidity, MARKET_STATE_LAYOUT_V3, Token, MAINNET_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { BN } from "@project-serum/anchor";
import { ammCreatePool, getWalletTokenAccount } from "./clients/raydiumUtil";
import { promises as fsPromises } from "fs";
import { loadKeypairs } from "./createKeys";
import { lookupTableProvider } from "./clients/LookupTableProvider";
import { searcherClient } from "./clients/jito";
import { Bundle as JitoBundle } from "jito-ts/dist/sdk/block-engine/types.js";
import promptSync from "prompt-sync";
import * as spl from "@solana/spl-token";
import { IPoolKeys } from "./clients/interfaces";
import { derivePoolKeys } from "./clients/poolKeysReassigned";

import bs58 from "bs58";
import path from "path";
import fs from "fs";

const prompt = promptSync();
const keyInfoPath = path.join(__dirname, "keyInfo.json");

type LiquidityPairTargetInfo = {
	baseToken: Token;
	quoteToken: Token;
	targetMarketId: PublicKey;
};

type AssociatedPoolKeys = {
	lpMint: PublicKey;
	id: PublicKey;
	baseMint: PublicKey;
	quoteMint: PublicKey;
};

export async function buyBundle() {
	const bundledTxns: VersionedTransaction[] = [];
	const keypairs: Keypair[] = loadKeypairs();

	let poolInfo: { [key: string]: any } = {};
	if (fs.existsSync(keyInfoPath)) {
		const data = fs.readFileSync(keyInfoPath, "utf-8");
		poolInfo = JSON.parse(data);
	}

	const lut = new PublicKey(poolInfo.addressLUT.toString());

	const lookupTableAccount = (await connection.getAddressLookupTable(lut)).value;

	if (lookupTableAccount == null) {
		console.log("Lookup table account not found!");
		process.exit(0);
	}

	// -------- step 1: ask nessesary questions for pool build --------
	const baseAddr = prompt("Token address: ") || "";
	const percentOfSupplyInput = prompt("% of your token balance in pool (Ex. 80): ") || "0";
	const solInPoolInput = prompt("# of SOL in LP (Ex. 10): ") || "0";
	const OpenBookID = prompt("OpenBook MarketID: ") || "";
	const jitoTipAmtInput = prompt("Jito tip in Sol (Ex. 0.01): ") || "0";
	const iterations = parseInt(prompt("Enter the number of iterations for bundle creation: ") || "0", 10);
	const delaySeconds = parseInt(prompt("Enter the delay between each iteration in seconds: ") || "0", 10);
	const jitoTipAmt = parseFloat(jitoTipAmtInput) * LAMPORTS_PER_SOL;
	const percentOfSupply = parseFloat(percentOfSupplyInput);
	const solInPool = parseFloat(solInPoolInput);

	let myToken = new PublicKey(baseAddr);
	let tokenInfo = await getMint(connection, myToken, "finalized", TOKEN_PROGRAM_ID);

	// Fetch balance of token
	const TokenBalance = await fetchTokenBalance(baseAddr, tokenInfo.decimals);
	// Declare the tokens to put into the pool
	// Quote will always be SOLLL
	const baseToken = new Token(TOKEN_PROGRAM_ID, new PublicKey(tokenInfo.address), tokenInfo.decimals); // Token to put into pool
	const quoteToken = DEFAULT_TOKEN.SOL; // SOL s quote
	const targetMarketId = new PublicKey(OpenBookID); // Convert to pubkey

	for (let i = 0; i < iterations; i++) {
		// -------- step 2: create pool txn --------
		const startTime = Math.floor(Date.now() / 1000);
		const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey);

		const marketBufferInfo: any = await connection.getAccountInfo(targetMarketId);
		const { baseMint, quoteMint, baseLotSize, quoteLotSize, baseVault, quoteVault, bids, asks, eventQueue, requestQueue } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data);

		let poolKeys: any = Liquidity.getAssociatedPoolKeys({
			version: 4,
			marketVersion: 3,
			baseMint,
			quoteMint,
			baseDecimals: tokenInfo.decimals,
			quoteDecimals: 9,
			marketId: targetMarketId,
			programId: PROGRAMIDS.AmmV4,
			marketProgramId: PROGRAMIDS.OPENBOOK_MARKET,
		});
		poolKeys.marketBaseVault = baseVault;
		poolKeys.marketQuoteVault = quoteVault;
		poolKeys.marketBids = bids;
		poolKeys.marketAsks = asks;
		poolKeys.marketEventQueue = eventQueue;
		//console.log("Pool Keys:", poolKeys);

		// Ensure percentOfSupply and TokenBalance are scaled to integers if they involve decimals.
		const baseMintAmount = new BN(Math.floor((percentOfSupply / 100) * TokenBalance).toString());

		// Ensure solInPool is scaled to an integer if it involves decimals.
		const quoteMintAmount = new BN((solInPool * Math.pow(10, 9)).toString());

		// If you need to clone the BN instances for some reason, this is correct. Otherwise, you can use baseMintAmount and quoteMintAmount directly.
		const addBaseAmount = new BN(baseMintAmount.toString());
		const addQuoteAmount = new BN(quoteMintAmount.toString());

		// Fetch LP Mint and write to json
		const associatedPoolKeys = getMarketAssociatedPoolKeys({
			baseToken,
			quoteToken,
			targetMarketId,
		});
		await writeDetailsToJsonFile(associatedPoolKeys, startTime, targetMarketId.toString()); // Write all objects to keyInfo

		// GLOBAL BLOCKHASH
		const { blockhash } = await connection.getLatestBlockhash("finalized");

		ammCreatePool({
			startTime,
			addBaseAmount,
			addQuoteAmount,
			baseToken,
			quoteToken,
			targetMarketId,
			wallet: walletconn.payer,
			walletTokenAccounts,
		}).then(async ({ txs }) => {
			const createPoolInstructions: TransactionInstruction[] = [];
			for (const itemIx of txs.innerTransactions) {
				createPoolInstructions.push(...itemIx.instructions);
			}

			const addressesMain: PublicKey[] = [];
			createPoolInstructions.forEach((ixn) => {
				ixn.keys.forEach((key) => {
					addressesMain.push(key.pubkey);
				});
			});
			const lookupTablesMain = lookupTableProvider.computeIdealLookupTablesForAddresses(addressesMain);

			const messageMain = new TransactionMessage({
				payerKey: wallet.publicKey,
				recentBlockhash: blockhash,
				instructions: createPoolInstructions,
			}).compileToV0Message(lookupTablesMain);
			const txPool = new VersionedTransaction(messageMain);

			try {
				const serializedMsg = txPool.serialize();
				if (serializedMsg.length > 1232) {
					console.log("tx too big");
					process.exit(0);
				}
				txPool.sign([walletconn.payer]);
			} catch (e) {
				console.log(e, "error signing txMain");
				return;
			}
			bundledTxns.push(txPool);
		});

		// -------- step 3: create swap txns --------
		const txMainSwaps: VersionedTransaction[] = await createWalletSwaps(targetMarketId, blockhash, keypairs, jitoTipAmt, lookupTableAccount);
		bundledTxns.push(...txMainSwaps);

		// -------- step 4: send bundle --------
		/*
        // Simulate each transaction
        for (const tx of bundledTxns) {
            try {
                const simulationResult = await connection.simulateTransaction(tx, { commitment: "processed" });
                console.log(simulationResult);

                if (simulationResult.value.err) {
                    console.error("Simulation error for transaction:", simulationResult.value.err);
                } else {
                    console.log("Simulation success for transaction. Logs:");
                    simulationResult.value.logs?.forEach(log => console.log(log));
                }
            } catch (error) {
                console.error("Error during simulation:", error);
            }
        }
        */

		await sendBundle(bundledTxns);

		// Delay between iterations
		await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
		bundledTxns.length = 0;
	}

	return;
}

async function createWalletSwaps(marketID: PublicKey, blockhash: string, keypairs: Keypair[], jitoTip: number, lut: AddressLookupTableAccount): Promise<VersionedTransaction[]> {
	const txsSigned: VersionedTransaction[] = [];
	const chunkedKeypairs = chunkArray(keypairs, 7); // EDIT CHUNKS?
	const keys = await derivePoolKeys(marketID);

	// Iterate over each chunk of keypairs
	for (let chunkIndex = 0; chunkIndex < chunkedKeypairs.length; chunkIndex++) {
		const chunk = chunkedKeypairs[chunkIndex];
		const instructionsForChunk: TransactionInstruction[] = [];

		// Iterate over each keypair in the chunk to create swap instructions
		for (let i = 0; i < chunk.length; i++) {
			const keypair = chunk[i];
			console.log(`Processing keypair ${i + 1}/${chunk.length}:`, keypair.publicKey.toString());

			if (keys == null) {
				console.log("Error fetching poolkeys");
				process.exit(0);
			}

			const TokenATA = await spl.getAssociatedTokenAddress(new PublicKey(keys.baseMint), keypair.publicKey);

			const wSolATA = await spl.getAssociatedTokenAddress(spl.NATIVE_MINT, keypair.publicKey);

			const { buyIxs } = makeBuy(keys, wSolATA, TokenATA, false, keypair); //  CHANGE FOR SELL (sellIxs/true)

			instructionsForChunk.push(...buyIxs); // CHANGE FOR SELL (sellIxs)
		}

		const message = new TransactionMessage({
			payerKey: keypair.publicKey,
			recentBlockhash: blockhash,
			instructions: instructionsForChunk,
		}).compileToV0Message([lut]);

		const versionedTx = new VersionedTransaction(message);

		const serializedMsg = versionedTx.serialize();
		console.log("Txn size:", serializedMsg.length);
		if (serializedMsg.length > 1232) {
			console.log("tx too big");
		}

		console.log(
			"Signing transaction with chunk signers",
			chunk.map((kp) => kp.publicKey.toString())
		);

		// Sign with the wallet for tip on the last instruction
		if (chunkIndex === chunkedKeypairs.length - 1) {
			versionedTx.sign([wallet]);
		}

		for (const keypair of chunk) {
			versionedTx.sign([keypair]);
		}

		txsSigned.push(versionedTx);
	}

	return txsSigned;
}

function chunkArray<T>(array: T[], size: number): T[][] {
	return Array.from({ length: Math.ceil(array.length / size) }, (v, i) => array.slice(i * size, i * size + size));
}

export async function sendBundle(bundledTxns: VersionedTransaction[]) {
	try {
		const bundleId = await searcherClient.sendBundle(new JitoBundle(bundledTxns, bundledTxns.length));
		console.log(`Bundle ${bundleId} sent.`);

		///*
		// Assuming onBundleResult returns a Promise<BundleResult>
		const result = await new Promise((resolve, reject) => {
			searcherClient.onBundleResult(
				(result) => {
					console.log("Received bundle result:", result);
					resolve(result); // Resolve the promise with the result
				},
				(e: Error) => {
					console.error("Error receiving bundle result:", e);
					reject(e); // Reject the promise if there's an error
				}
			);
		});

		console.log("Result:", result);
		//*/
	} catch (error) {
		const err = error as any;
		console.error("Error sending bundle:", err.message);

		if (err?.message?.includes("Bundle Dropped, no connected leader up soon")) {
			console.error("Error sending bundle: Bundle Dropped, no connected leader up soon.");
		} else {
			console.error("An unexpected error occurred:", err.message);
		}
	}
}

async function fetchTokenBalance(TokenPubKey: string, decimalsToken: number) {
	const ownerPubKey = wallet.publicKey;

	const response = await connection.getParsedTokenAccountsByOwner(ownerPubKey, {
		mint: new PublicKey(TokenPubKey),
	});

	let TokenBalance = 0;
	for (const account of response.value) {
		const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
		TokenBalance += amount;
	}

	return TokenBalance * 10 ** decimalsToken;
}

function makeBuy(poolKeys: IPoolKeys, wSolATA: PublicKey, TokenATA: PublicKey, reverse: boolean, keypair: Keypair) {
	const programId = new PublicKey("4BsBhTFFxKaswZioPvRMqRqVYTd668wZvAc3oKLZP2tx"); // MY PROGRAM
	const account1 = TOKEN_PROGRAM_ID; // token program
	const account2 = poolKeys.id; // amm id  writable
	const account3 = poolKeys.authority; // amm authority
	const account4 = poolKeys.openOrders; // amm open orders  writable
	const account5 = poolKeys.targetOrders; // amm target orders  writable
	const account6 = poolKeys.baseVault; // pool coin token account  writable  AKA baseVault
	const account7 = poolKeys.quoteVault; // pool pc token account  writable   AKA quoteVault
	const account8 = poolKeys.marketProgramId; // serum program id
	const account9 = poolKeys.marketId; //   serum market  writable
	const account10 = poolKeys.marketBids; // serum bids  writable
	const account11 = poolKeys.marketAsks; // serum asks  writable
	const account12 = poolKeys.marketEventQueue; // serum event queue  writable
	const account13 = poolKeys.marketBaseVault; // serum coin vault  writable     AKA marketBaseVault
	const account14 = poolKeys.marketQuoteVault; //   serum pc vault  writable    AKA marketQuoteVault
	const account15 = poolKeys.marketAuthority; // serum vault signer       AKA marketAuthority
	let account16 = wSolATA; // user source token account  writable
	let account17 = TokenATA; // user dest token account   writable
	const account18 = keypair.publicKey; // user owner (signer)  writable
	const account19 = MAINNET_PROGRAM_ID.AmmV4; // ammV4  writable

	if (reverse == true) {
		account16 = TokenATA;
		account17 = wSolATA;
	}

	const buffer = Buffer.alloc(16);
	const prefix = Buffer.from([0x09]);
	const instructionData = Buffer.concat([prefix, buffer]);
	const accountMetas = [
		{ pubkey: account1, isSigner: false, isWritable: false },
		{ pubkey: account2, isSigner: false, isWritable: true },
		{ pubkey: account3, isSigner: false, isWritable: false },
		{ pubkey: account4, isSigner: false, isWritable: true },
		{ pubkey: account5, isSigner: false, isWritable: true },
		{ pubkey: account6, isSigner: false, isWritable: true },
		{ pubkey: account7, isSigner: false, isWritable: true },
		{ pubkey: account8, isSigner: false, isWritable: false },
		{ pubkey: account9, isSigner: false, isWritable: true },
		{ pubkey: account10, isSigner: false, isWritable: true },
		{ pubkey: account11, isSigner: false, isWritable: true },
		{ pubkey: account12, isSigner: false, isWritable: true },
		{ pubkey: account13, isSigner: false, isWritable: true },
		{ pubkey: account14, isSigner: false, isWritable: true },
		{ pubkey: account15, isSigner: false, isWritable: false },
		{ pubkey: account16, isSigner: false, isWritable: true },
		{ pubkey: account17, isSigner: false, isWritable: true },
		{ pubkey: account18, isSigner: true, isWritable: true },
		{ pubkey: account19, isSigner: false, isWritable: true },
	];

	const swap = new TransactionInstruction({
		keys: accountMetas,
		programId,
		data: instructionData,
	});

	let buyIxs: TransactionInstruction[] = [];
	let sellIxs: TransactionInstruction[] = [];

	if (reverse === false) {
		buyIxs.push(swap);
	}

	if (reverse === true) {
		sellIxs.push(swap);
	}

	return { buyIxs, sellIxs };
}

function getMarketAssociatedPoolKeys(input: LiquidityPairTargetInfo) {
	const poolInfo = Liquidity.getAssociatedPoolKeys({
		version: 4,
		marketVersion: 3,
		baseMint: input.baseToken.mint,
		quoteMint: input.quoteToken.mint,
		baseDecimals: input.baseToken.decimals,
		quoteDecimals: input.quoteToken.decimals,
		marketId: input.targetMarketId,
		programId: PROGRAMIDS.AmmV4,
		marketProgramId: MAINNET_PROGRAM_ID.OPENBOOK_MARKET,
	});
	return poolInfo;
}

async function writeDetailsToJsonFile(associatedPoolKeys: AssociatedPoolKeys, startTime: number, marketID: string) {
	const filePath = path.join(__dirname, "keyInfo.json");

	try {
		// Read the current contents of the file
		let fileData = {};
		try {
			const currentData = await fsPromises.readFile(filePath, "utf-8");
			fileData = JSON.parse(currentData);
		} catch (error) {
			console.log("poolinfo.json doesn't exist or is empty. Creating a new one.");
		}

		// Update only the specific fields related to the new pool
		const updatedData = {
			...fileData, // Spread existing data to preserve it
			lpTokenAddr: associatedPoolKeys.lpMint.toString(),
			targetPool: associatedPoolKeys.id.toString(),
			baseMint: associatedPoolKeys.baseMint.toString(),
			quoteMint: associatedPoolKeys.quoteMint.toString(),
			openTime: new Date(startTime * 1000).toISOString(),
			marketID,
		};

		// Write the updated data back to the file
		await fsPromises.writeFile(filePath, JSON.stringify(updatedData, null, 2), "utf8");
		console.log("Successfully updated the JSON file with new pool details.");
	} catch (error) {
		console.error("Failed to write to the JSON file:", error);
	}
}
