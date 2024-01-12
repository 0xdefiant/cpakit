export async function fetchTokenPrice(tokenSymbol: string, timestamp: string) {
    console.log("tokenSymbol: ", tokenSymbol)
    console.log("timestamp: ", timestamp)

    try {
        const response = await fetch(`http://localhost:3000/api/tx/token-price?symbol=${tokenSymbol}&timestamp=${timestamp}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
                
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const price = await response.json();
        console.log("Price: ", price)
        return {
            props: {
                usdPrice: price,
            }
        };
    } catch (error) {
        console.error('Error fetching token price:', error);
        return { props: { usdPrice: 0 } }; 
    }
};

