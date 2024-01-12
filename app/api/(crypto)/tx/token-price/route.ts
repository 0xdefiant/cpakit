import coins from '@/libs/json/coingeckoFilteredTokens';


export async function GET(req: Request) {
    console.log("token-price reached!!!!!!!!")
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol').toLowerCase();
    const timestamp = url.searchParams.get('timestamp')
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const apiTimestamp = `${day}-${month}-${year}`; 
    
    console.log("symbol: ", symbol)
    console.log("apiTimestamp: ", apiTimestamp)

    if (!symbol || !timestamp) {
        return new Response(JSON.stringify({ error: 'symbol and timestamp is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
    }

    const coin = coins.find(coin => coin.symbol.toLowerCase() === symbol);
    console.log("coin: ", coin)
    if (!coin) {
        return new Response(JSON.stringify({ error: 'Coin not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const coinId = coin.id;
    console.log("coinId: ", coinId)

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${apiTimestamp}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[token-price] Data for ${symbol} on ${apiTimestamp}:`, data.market_data.current_price.usd)

        return new Response(JSON.stringify(data.market_data.current_price.usd), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(`Error fetching price for transaction: ${symbol}`, error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
