import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(query, (answer: string) => {
        resolve(answer);
      });
    });
}

export async function calculateTokensBoughtPercentage(steps: number = 27) {
  let RSOL = +await question('Initial SOL in LP: ');
  let RToken = +await question('Initial TOKENS in LP: ');
  let initialBuyAmount = +await question('Buy amount increment: ');
  let totalTokensBought: number = 0; // Initialize total tokens bought
  let totalSolRequired: number = 0; // Initialize total SOL required
  const initialRToken = RToken;

  // Loop through each step, increasing the buy amount incrementally
  for (let step = 1; step <= steps; step++) {
      let buyAmount: number = initialBuyAmount * step; // Incremental buy amount
      let RTokenPrime: number = (RToken * RSOL) / (RSOL + buyAmount); // New token reserve after buy
      let tokensReceived: number = RToken - RTokenPrime; // Tokens received for this buy amount
      
      totalTokensBought += tokensReceived; // Update total tokens bought
      totalSolRequired += buyAmount; // Update total SOL required
      RToken = RTokenPrime; // Update the token reserve for the next calculation
      RSOL += buyAmount; // Update the SOL reserve for the next calculation
  }

  // Calculate the total tokens bought as a percentage of the initial token reserve
  let tokensBoughtPercentage: number = (totalTokensBought / initialRToken) * 100;

  console.log("With the buy sequence you will buy: ~" + tokensBoughtPercentage.toFixed(2) + "% of the tokens in the LP");
  console.log(`Total SOL required for the sequence of buys: ${totalSolRequired.toFixed(2)} SOL`);
}