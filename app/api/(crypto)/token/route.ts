const apikey = process.env.MORALIS_API_KEY;

export async function GET(request: Request) {

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

    const balanceResponse = await fetch(`https://deep-index.moralis.io/api/v2.2/${walletAddress}/erc20?chain=eth`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'X-API-Key': apikey
      },
    });
    if (!balanceResponse.ok) {
        throw new Error(`Error fetching TX data: ${balanceResponse.status}`);
    }

    const balanceResponseJson = await balanceResponse.json();
    console.log('Balance ResponseJSON', balanceResponseJson)

    if (!Array.isArray(balanceResponseJson)) {
        console.error("Expected an array, but got:", balanceResponseJson);
        return new Response(JSON.stringify({ error: 'Unexpected response format' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const isSpamSymbol = (text: string) => {
        if (typeof text !== 'string') {
            return false;
        }
    
        const spamIndicators = [
            "visit", "claim", "rewards", "gift", 
            "https://", ".pro", ".gift", ".net"
        ];
        
        const textLower = text.toLowerCase();
        return spamIndicators.some(indicator => textLower.includes(indicator));
    };
    
    const isSpamToken = (token: any) => {
        return isSpamSymbol(token.symbol) || isSpamSymbol(token.name);
    };
    
    const filteredTokens = balanceResponseJson.filter((token: any) => 
        !token.possible_spam && !isSpamToken(token)
    );
    console.log("filteredTokens: ", filteredTokens)
    
    const tokensForRequestBody = filteredTokens.map((token: any) => {
        return { token_address: token.token_address };
      });
      
    console.log("Tokens for Request Body: ", tokensForRequestBody);
    
    const priceResponse = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/prices?chain=eth`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-API-Key': apikey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tokens: tokensForRequestBody
        })
    });

    if (!priceResponse.ok) {
    throw new Error(`Error fetching price data: ${priceResponse.status}`);
    }

    const priceJson = await priceResponse.json();
    console.log("Price Response: ", priceJson)

    const combinedData = filteredTokens.map((token: any) => {
        const priceInfo = priceJson.find((p: any) => p.tokenSymbol === token.symbol);
        return { ...token, priceInfo };
    });
    console.log("Combined Data: ", combinedData)

    return new Response(JSON.stringify({ combinedData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
