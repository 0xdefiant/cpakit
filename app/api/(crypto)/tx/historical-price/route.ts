import coins from '@/libs/tokens/coingeckoFilteredTokens';

const apiKey = process.env.COINGECKO_API_KEY;

export async function GET(req: Request) {
    console.log("--------Historical token-price reached-------");
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol').toLowerCase();
    const timestamp = url.searchParams.get('timestamp')
    const contractAddress = url.searchParams.get('contractAddress')
    if (!symbol || !timestamp) {
        return new Response(JSON.stringify({ error: 'symbol and timestamp are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const date = new Date(timestamp);
    const apiTimestamp = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; 

    console.log('symbol:', symbol);
    console.log('apiTimestamp:', apiTimestamp);
    console.log('contractAddress:', contractAddress);

    let coinId = coins.find(coin => coin.symbol.toLowerCase() === symbol)?.id;

    if (!coinId) {
        try {
            const chainId = 'ethereum';
            const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${chainId}/contract/${contractAddress}&x_cg_demo_api_key=${apiKey}`, {
                headers: { 'accept': 'application/json' }
            });

            if (!coinResponse.ok) {
                throw new Error(`HTTP error! status: ${coinResponse.status}`);
            }

            const findCoinId = await coinResponse.json();
            console.log('FindCoinId:', findCoinId);

            coinId = findCoinId.id;
            console.log('coinId:', coinId);
        } catch (error) {
            console.error('Error fetching coin ID:', error);
            return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${apiTimestamp}&x_cg_demo_api_key=${apiKey}`, {
            headers: { 'accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`General Data for ${symbol} on ${apiTimestamp}:`, data);
        console.log(`[token-price] Data for ${symbol} on ${apiTimestamp}:`, data.market_data.current_price.usd);

        return new Response(JSON.stringify(data.market_data.current_price.usd), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}