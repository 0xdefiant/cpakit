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

        const isSpamSymbol = (symbol: any) => {
            const spamWords = ["visit", "claim", "rewards", "gift"];
            return spamWords.some(spamWord => symbol.toLowerCase().includes(spamWord));
          };

        console.log("TX Data Array: ", TXsForOwnerResponse.result);
        const filteredTransactions = TXsForOwnerResponse.result.filter((tx: any) => 
            !tx.possible_spam && !isSpamSymbol(tx.token_symbol)
          );
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