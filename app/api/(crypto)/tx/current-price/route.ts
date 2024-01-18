const apikey = process.env.MORALIS_API_KEY;

export async function GET(request: Request) {
    const url = new URL(request.url);
    const address = url.searchParams.get('address');
    console.log("Token Address received in API route: ", address);

    if (!address) {
        return new Response(JSON.stringify({ error: 'Symbol is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
    }

    const priceResponse = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/price?chain=eth&include=percent_change`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-API-Key': apikey,
        },
    });

    if (!priceResponse.ok) {
        throw new Error(`CP Error Fetching Price Data: ${priceResponse.status}`)
    }

    const priceJson = await priceResponse.json();
    console.log("Price Response: ", priceJson)

    return new Response(JSON.stringify({ priceJson }), {
        status: 200,
        headers: {
            'Content-type': 'application/json'
        }
    });
}