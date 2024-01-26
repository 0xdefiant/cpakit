const apikey = process.env.MORALIS_API_KEY;

const cache: { [key: string]: any } = {};
// Function to check if the cache is stale (e.g., data older than 5 minutes)
function isCacheStale(timestamp: number) {
    return Date.now() - timestamp > 300000; // 5 minutes in milliseconds
}

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

    // Check cache first
    if (cache[address] && !isCacheStale(cache[address].timestamp)) {
        console.log("Returning cached data");
        return new Response(JSON.stringify({ priceJson: cache[address].data }), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
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

    // Update cache
    cache[address] = {
        timestamp: Date.now(),
        data: priceJson
    };

    return new Response(JSON.stringify({ priceJson }), {
        status: 200,
        headers: {
            'Content-type': 'application/json'
        }
    });
}