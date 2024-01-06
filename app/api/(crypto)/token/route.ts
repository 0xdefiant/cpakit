const apikey = process.env.ALCHEMY_API_KEY;

export async function POST(request: Request) {
    console.log("API Route Called");

    const requestJson = await request.json();
    const address = requestJson.address;
    console.log("Address received in API route: ", address);

    const balanceResponse = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${apikey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [address]
      }),
    })
  
    const balanceData = await balanceResponse.json();
    console.log("Address Balance Data: ", balanceData);

    const tokenMetadataPromises = balanceData.result.tokenBalances.map(async (token: any) => {
        const metadataResponse = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${apikey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "alchemy_getTokenMetadata",
                params: [token.contractAddress]
            }),
        });

        return metadataResponse.json();
    });

    const tokenMetadata = await Promise.all(tokenMetadataPromises);
    console.log("Token Metadata: ", tokenMetadata);

    const combinedTokenData = tokenMetadata.map((metadata, index) => {
        return {
            ...metadata,
            balance: balanceData.result.tokenBalances[index].tokenBalance
        };
    });

    console.log("Combined Token Data: ", combinedTokenData);

    return new Response(JSON.stringify({ combinedTokenData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
