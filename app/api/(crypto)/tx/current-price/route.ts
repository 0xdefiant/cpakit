const apikey = process.env.COIN_MARKET_CAP_API_KEY;

const cache: { [key: string]: any } = {};
// Function to check if the cache is stale (e.g., data older than 20 minutes)
function isCacheStale(timestamp: number) {
    return Date.now() - timestamp > 1200000; // 20 minutes in milliseconds
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol'); // Get symbol from URL
    console.log("Symbol received in API route: ", symbol);

    if (!symbol) {
        return new Response(JSON.stringify({ error: 'Symbol is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
        });
    }

    // Check cache first
    if (cache[symbol] && !isCacheStale(cache[symbol].timestamp)) {
        console.log("Returning cached data");
        return new Response(JSON.stringify(cache[symbol].data), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        });
    }

    // CoinMarketCap API endpoint
    const cmcEndpoint = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;

    // Fetch price data from CoinMarketCap
    const priceResponse = await fetch(`${cmcEndpoint}?symbol=${symbol}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-CMC_PRO_API_Key': apikey,
        },
    });

    if (!priceResponse.ok) {
        throw new Error(`Error Fetching Price Data: ${priceResponse.status}`);
    }

    const rawPriceJson = await priceResponse.json();
    console.log("Raw CMC Response: ", rawPriceJson);

    const correctCaseSymbol = Object.keys(rawPriceJson.data).find(key => key.toLowerCase() === symbol.toLowerCase());

    if (!correctCaseSymbol) {
        return new Response(JSON.stringify({ error: 'Symbol not found in CMC response' }), {
            status: 404,
            headers: {
                'Content-type': 'application/json'
            }
        });
    }

    const priceJson = rawPriceJson.data[correctCaseSymbol].quote.USD.price; // Extract USD price
    console.log("Price Response: ", priceJson)
    
    // Update cache
    cache[symbol] = {
        timestamp: Date.now(),
        data: priceJson
    };

    return new Response(JSON.stringify(priceJson), {
        status: 200,
        headers: {
            'Content-type': 'application/json'
        }
    });
}
