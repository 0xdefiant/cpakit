const apikey = process.env.MORALIS_API_KEY;
import { fetchTokenPrice } from "@/libs/fetchTokenPrice";
import coins from "@/libs/tokens/coingeckoFilteredTokens";

export async function GET(request: Request) {
    console.log("-------------------------tx api route reached---------------------")

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
        console.log("TX for owner: ", TXsForOwnerResponse)

        const isSpamSymbol = (symbol: any, address: string) => {
          const spamWords = ["visit", "claim", "rewards", "gift"];
          const isSpam = spamWords.some(spamWord => symbol.toLowerCase().includes(spamWord));
      
          const isInvalidUSDC = symbol === 'USDC' && address !== '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      
          return isSpam || isInvalidUSDC;
        };
        console.log("Coins from Route: ", coins);

        const isTokenListed = (tokenSymbol: string) => {
            return coins.some(coin => coin.symbol.toLowerCase() === tokenSymbol.toLowerCase());
        };
      
        const filteredTransactions = TXsForOwnerResponse.result.filter((tx: any) => 
            !tx.possible_spam && 
            isTokenListed(tx.token_symbol) && // Check if the token is listed
            !isSpamSymbol(tx.token_symbol, tx.address) &&
            Number(tx.value) > 0
        );
        console.log(" 1) filteredTransactions: ", filteredTransactions[0])


    return new Response(JSON.stringify(filteredTransactions), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });

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