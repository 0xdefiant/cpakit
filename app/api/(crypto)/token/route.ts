export const dynamic = 'force-dynamic'

const apikey = process.env.ALCHEMY_API_KEY;

export async function POST(request: Request) {
    const requestJson = await request.json();
    const address = requestJson.address;
    console.log("this is address: ", address);

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
    console.log("data from /token", balanceData);

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
    console.log("token metadata", tokenMetadata);

    // Combine balance and metadata information
    const combinedTokenData = tokenMetadata.map((metadata, index) => {
        return {
            ...metadata, // Spread operator to include all properties of metadata
            balance: balanceData.result.tokenBalances[index].tokenBalance // Add balance from corresponding index
        };
    });

    console.log("Combined Token Data: ", combinedTokenData)

    return new Response(JSON.stringify({ combinedTokenData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}