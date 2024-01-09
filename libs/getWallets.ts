import { getSession } from "next-auth/react";

export async function getWallets() {
    // Extract user ID from the context or session
        const session = await getSession();
        const userId = session?.user?.id;
    
        try {
            const response = await fetch(`/api/wallet?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const wallets = await response.json();
    
            return {
                props: {
                    wallets: wallets
                }
            };
        } catch (error) {
            console.error('Failed to fetch wallets', error);
            return {
                props: {
                    wallets: []
                }
            };
        }
    }