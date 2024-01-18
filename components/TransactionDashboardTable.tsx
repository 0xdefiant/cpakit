"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import { ToastProvider } from '@radix-ui/react-toast';
import { useSession } from 'next-auth/react';

type TxMetadata = {
    address: string;
    tokenName: string;
    tokenSymbol: string;
    fromAddress: string;
    toAddress: string;
    tx_hash: string;
    block_timestamp: string;
    value_decimal: number;
    usdPrice: number | null;
    historicalTokenPrice: number | null;
};

const TxDashboardTable = () => {
    const [TxMetadata, setTxMetadata] = useState<TxMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [tokenPrice, setTokenPrice] = useState<number | null>(null);


    useEffect(() => {
        if (!address) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
    
            try {
                const response = await fetch(`/api/tx?address=${address}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                console.log("This is the response: ", response)
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('API processed response:', data);

                const organizedData = data.map((item: any) => {
                    let usdPriceValue = 0;
                    if (item.usdPrice && item.usdPrice.props && !isNaN(Number(item.usdPrice.props.usdPrice))) {
                        usdPriceValue = Number(item.usdPrice.props.usdPrice);
                    }
                    return {
                        address: item.address,
                        tokenName: item.token_name,
                        tokenSymbol: item.token_symbol,
                        fromAddress: item.from_address,
                        toAddress: item.to_address,
                        tx_hash: item.transaction_hash,
                        block_timestamp: item.block_timestamp,
                        value_decimal: item.value_decimal,
                    };
                });
                console.log("organized data: ", organizedData)
                console.log("usdPrice hopefully: ", Number(organizedData[0]?.usdPrice?.props));
    
                Promise.all(organizedData).then((completedData) => {
                    setTxMetadata(completedData);
                });
            } catch (error) {
                console.error('Fetching error:', error);
                setError('Failed to load data');
            }
    
            setIsLoading(false);
        };
    
        fetchData();
    }, [address]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setAddress(inputValue);
        setIsInputEmpty(inputValue === '');
    };

    const TxTotal = () => {
        return TxMetadata.reduce((total, meta) => {
            const valueDecimal = typeof meta.value_decimal === 'string' ? parseFloat(meta.value_decimal) : meta.value_decimal;
            return total + valueDecimal;
        }, 0);
    };

    const formatAddress = (address: string) => {
        if (!address || address.length < 9) {
          return address;
        }
        return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
      };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      };
    
    const formatDecimal = (value: number | string) => {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (numericValue < 1) {
            return numericValue.toFixed(6);
        } else {
            const formattedValue = numericValue.toFixed(3);
            return formattedValue.replace(/\.000$/, ''); 
        }
    };

    const isUserInvolved = (tx: TxMetadata) => {
        return tx.fromAddress.toLowerCase() === address.toLowerCase() || tx.toAddress.toLowerCase() === address.toLowerCase();
    };

    const fetchedPricesCache = useRef(new Map()).current;

    const fetchHistoricalTokenPrice = async (index: number, tokenSymbol: string, blockTimestamp: string) => {
        try {
            if (tokenSymbol.toLowerCase() === 'usdc') {
                updateHistoricalPrice(index, 1);
                return;
            }

            // Format to accurately cache, this is not sent to api
            const date = new Date(blockTimestamp);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedTimestamp = `${day}-${month}-${year}`;

            const cacheKey = `${tokenSymbol.toLowerCase()}-${formattedTimestamp}`;

            if (fetchedPricesCache.has(cacheKey)) {
                updateHistoricalPrice(index, fetchedPricesCache.get(cacheKey));
                return;
            }

            const url = `/api/tx/historical-price?symbol=${encodeURIComponent(tokenSymbol)}&timestamp=${encodeURIComponent(blockTimestamp)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Data: ", data)
            
            if (!data) {
                setToastMessage("Price not fetched, wait a minute and try again");
                return; 
            }

            fetchedPricesCache.set(cacheKey, data);
            updateHistoricalPrice(index, data);
        } catch (error) {
            console.error('Error fetching token price:', error);
            setToastMessage("Price not fetched, wait a minute and try again");
            updateHistoricalPrice(index, null);
        }
    };

    const updateHistoricalPrice = (index: number, price: number | null) => {
        setTxMetadata(prevMetadata => prevMetadata.map((item, idx) => 
            idx === index ? { ...item, historicalTokenPrice: price } : item
        ));
    };

    const HistoricalPriceButton = ({ index, tokenSymbol, blockTimestamp }: { index: number, tokenSymbol: string, blockTimestamp: string }) => (
        <Button variant='outline' onClick={() => fetchHistoricalTokenPrice(index, tokenSymbol, blockTimestamp)}>Price at Tx Time</Button>
    );



    const fetchCurrentTokenPrice = async (index: number, address: string) => {
        try {
            if (address.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
                updateCurrentPrice(index, 1);
                return;
            }

            const cacheKey = address.toLowerCase();

            if (fetchedPricesCache.has(cacheKey)) {
                updateCurrentPrice(index, fetchedPricesCache.get(cacheKey));
                return;
            }

            const url = `/api/tx/current-price?address=${encodeURIComponent(address)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("TX dash Table: ", data)
            const price = data.priceJson.usdPrice;
            console.log("TX dash Table - usdPrice: ", price)

            if (!data) {
                setToastMessage("Current price not fetched, wait a minute and try again");
                return;
            }

            fetchedPricesCache.set(cacheKey, price);
            updateCurrentPrice(index, price);
        } catch (error) {
            console.error('Error fetching current token price:', error);
            setToastMessage("Current price not fetched, wait a minute and try again");
            updateCurrentPrice(index, null);
        }
    };
    const updateCurrentPrice = (index: number, price: number | null) => {
        setTxMetadata(prevMetadata => prevMetadata.map((item, idx) =>
            idx === index ? { ...item, usdPrice: price } : item
        ));
    };
    const CurrentPriceButton = ({ index, address }: { index: number, address: string }) => (
        <Button variant='outline' onClick={() => fetchCurrentTokenPrice(index, address)}>Current Price</Button>
    );


    const renderToast = () => {
        if (!toastMessage) return null;

        setTimeout(() => setToastMessage(''), 3000); // Hide after 3 seconds

        return (
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#323232', // Dark background for modern look
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
                zIndex: 1000, // Ensure it's on top of other elements
                transition: 'all 0.3s ease-in-out', // Smooth transition for appearing and disappearing
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {toastMessage}
            </div>
        );
    };


    return (
        <div>
            <div className='flex items-center'>
            <Input
                type="text"
                className='mr-2'
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter Ethereum Address"
            />
            <Button onClick={() => setAddress(address)}>Fetch Txs</Button>
            </div>
            <Separator className='my-4' />


            {isInputEmpty && (
                <div>Please enter an Ethereum address to fetch NFTs.</div>
            )}
    
            {isLoading && !isInputEmpty && (
                <Table>
                    <TableCaption>Waiting for address to find Transactions...</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(1)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="w-[60px] h-[20px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="w-[40px] h-[20px] rounded-full" /></TableCell>
                                <TableCell className=''>
                                    <div className="flex justify-end">
                                        <Skeleton className="w-[60px] h-[20px] rounded-full" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
    
            {error && <div>Error: {error}</div>}
    
            {!isLoading && !error && !isInputEmpty && (
                <div>
                {renderToast()}
                <Table>
                    <TableCaption>A list of your Txs.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Historical Price</TableHead>
                            <TableHead className="text-right">Current Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {TxMetadata.map((metaData, index) => (
                            <TableRow key={index}>
                                <TableCell>{metaData.tokenSymbol}</TableCell>
                                <TableCell className={isUserInvolved(metaData) ? "bg-yellow-900" : ""}>{formatAddress(metaData.fromAddress)}</TableCell>
                                <TableCell className={isUserInvolved(metaData) ? "bg-yellow-900" : ""}>{formatAddress(metaData.toAddress)}</TableCell>
                                <TableCell>{formatDate(metaData.block_timestamp)}</TableCell>
                                <TableCell>{formatDecimal(metaData.value_decimal)}</TableCell>
                                <TableCell>
                                {typeof metaData.historicalTokenPrice === 'number' ? (
                                        <div>${metaData.historicalTokenPrice.toFixed(2)}</div>
                                    ) : (
                                        <HistoricalPriceButton index={index} tokenSymbol={metaData.tokenSymbol} blockTimestamp={metaData.block_timestamp} />
                                        )}
                                </TableCell>
                                <TableCell className="text-right">
                                {typeof metaData.usdPrice === 'number' ? ( // TODO: fix this code to render the button when not chosen to fetch current price, and render the current price when the API returns the price
                                        <div>${metaData.usdPrice.toFixed(2)}</div>
                                    ) : (
                                        <CurrentPriceButton index={index} address={metaData.address} />
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6}>Total Tx Value</TableCell>
                            <TableCell className="text-right">{formatDecimal(TxTotal())}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                </div>
            )}
        </div>
    );
};

export default TxDashboardTable;
