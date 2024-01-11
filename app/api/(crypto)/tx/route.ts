const apikey = process.env.MORALIS_API_KEY;

export async function GET(request: Request) {
    console.log("tx api route called")

    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('address');
    console.log("Address received in API route: ", walletAddress);

    if (!walletAddress) {
        return new Response(JSON.stringify({ error: 'Address is required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

    try {
        const TXsForOwner = await fetch(`https://deep-index.moralis.io/api/v2.2/${walletAddress}/erc20/transfers?chain=eth`, {
            method: 'GET',
            headers: {
            'accept': 'application/json',
            'X-API-KEY': apikey
            },
        });

        if (!TXsForOwner.ok) {
            throw new Error(`Error fetching TX data: ${TXsForOwner.status}`);
        }

        const TXsForOwnerResponse = await TXsForOwner.json();
        console.log("route.ts TXsfor owner response: ", TXsForOwnerResponse)

        const isSpamSymbol = (symbol: any, address: string) => {
          const spamWords = ["visit", "claim", "rewards", "gift"];
          const isSpam = spamWords.some(spamWord => symbol.toLowerCase().includes(spamWord));
      
          // Check for USDC transactions with the specific address
          const isInvalidUSDC = symbol === 'USDC' && address !== '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      
          return isSpam || isInvalidUSDC;
      };
      
      const filteredTransactions = TXsForOwnerResponse.result.filter((tx: any) => 
          !tx.possible_spam && !isSpamSymbol(tx.token_symbol, tx.address) &&
          Number(tx.value) > 0
      );      
          // Add USD prices to each transaction
    for (let tx of filteredTransactions) {
      try {
          const txTimePriceResponse = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${tx.address}/price?chain=eth&to_block=${tx.block_number}`, {
              method: 'GET',
              headers: {
                  'accept': 'application/json',
                  'X-API-KEY': apikey
              },
          });

          if (!txTimePriceResponse.ok) {
              throw new Error(`Error fetching price data: ${txTimePriceResponse.status}`);
          }

          const txTimePrice = await txTimePriceResponse.json();
          tx.usdPrice = txTimePrice.usdPrice;
      } catch (error) {
          console.error(`Error fetching price for transaction ${tx.transaction_hash}:`, error);
          tx.usdPrice = null; // Setting null if there was an error fetching the price
      }
  }
  console.log("Filtered results: ", filteredTransactions);


      return Response.json( filteredTransactions )

    } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
        status: 500,
        headers: {
        'Content-Type': 'application/json'
        }
    });
    }
}