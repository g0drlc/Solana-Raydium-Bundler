import { PublicKey, Signer, Transaction } from "@solana/web3.js"
import {
  ENDPOINT as _ENDPOINT,
  Currency,
  DEVNET_PROGRAM_ID,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  Token,
  TOKEN_PROGRAM_ID,
  TxVersion,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  Keypair, 
} from '@solana/web3.js'; 

export const SUPPORTED_CHAINS = [
    {
        id: 999999999,
        name: 'Solana Devnet',
        symbol: 'SOL',
        rpc: 'https://api.devnet.solana.com',
        testnet: true,
        limit: 0.1,
        fee: 1,
         
    },
    {
        id: 9999999991,
        name: 'Solana mainnet',
        symbol: 'SOL',
        rpc: 'https://api.mainnet-beta.solana.com',
        testnet: false,
        limit: 0.1,
        fee: 1,
        
    },
]
 

export const METADATA_2022_PROGRAM_ID = new PublicKey("META4s4fSmpkTbZoUsgC1oBnWB31vQcmnN8giPw51Zu")
export const RAYDIUMF_PROGRAM_ID = new PublicKey("AE6Go5VqcagBJi2RnNcPiHmVGHd27deDEJBNAEEnzw8Y")
export const METADATA_2022_PROGRAM_ID_TESTNET = new PublicKey("M1tgEZCz7fHqRAR3G5RLxU6c6ceQiZyFK7tzzy4Rof4")

 export const TESTNET_SHOW = true

export const BOT_NAME = 'DexbotDevs Solana Launcher'

export const EXPLORER_ADDRESS_BASE = "https://explorer.solana.com/address/";

export const OPENBOOK_DEX = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"; // openbook now srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX
export const OPENBOOK_DEX_DEVNET = "EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj";
export const SERUM_DEX_V3_DEVNET = "DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY";

export const DEX_PROGRAMS: { [key: string]: string } = {
  srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX: "Openbook Dex",
  EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj: "Openbook Dex Devnet",
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin": "Serum Dex (Compromised)",
  DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY: "Serum Dex V3 Devnet",
};

export const MAX_U128 = "340282366920938463463374607431768211455";
 
export const MARKET_ACCOUNT_FLAGS_B58_ENCODED = "W723RTUpoZ";

export type TransactionWithSigners = {
    transaction: Transaction;
    signers: Array<Signer>;
  };
 
  export const PROGRAMIDS = MAINNET_PROGRAM_ID;
  
  export const ENDPOINT = _ENDPOINT;
  
  export const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;
  
  export const makeTxVersion = TxVersion.V0;  
  
  export const addLookupTableInfo = LOOKUP_TABLE_CACHE   
 
 
  export const DEFAULT_TOKEN = {
    'SOL': new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
    'USDC': new Token(TOKEN_PROGRAM_ID, new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), 6, 'USDC', 'USDC'),
    'RAY': new Token(TOKEN_PROGRAM_ID, new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), 6, 'RAY', 'RAY'),
    'RAY_USDC-LP': new Token(TOKEN_PROGRAM_ID, new PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'), 6, 'RAY-USDC', 'RAY-USDC'),
  }
  export const AUTHORITY_AMM = 'amm authority'
  export const AMM_ASSOCIATED_SEED = 'amm_associated_seed'
  export const TARGET_ASSOCIATED_SEED = 'target_associated_seed'
  export const WITHDRAW_ASSOCIATED_SEED = 'withdraw_associated_seed'
  export const OPEN_ORDER_ASSOCIATED_SEED = 'open_order_associated_seed'
  export const COIN_VAULT_ASSOCIATED_SEED = 'coin_vault_associated_seed'
  export const PC_VAULT_ASSOCIATED_SEED = 'pc_vault_associated_seed'
  export const LP_MINT_ASSOCIATED_SEED = 'lp_mint_associated_seed'
  export const TEMP_LP_TOKEN_ASSOCIATED_SEED = 'temp_lp_token_associated_seed'
  
  export const feeId = new PublicKey("7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5")