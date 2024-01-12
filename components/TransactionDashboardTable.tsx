"use client"

import React, { useState, useEffect } from 'react';
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

type TxMetadata = {
    tokenName: string;
    tokenSymbol: string;
    fromAddress: string;
    toAddress: string;
    tx_hash: string;
    block_timestamp: string;
    value_decimal: number;
    usdPrice: number;
};

const TxDashboardTable = () => {
    const [TxMetadata, setTxMetadata] = useState<TxMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState('');



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
                        tokenName: item.token_name,
                        tokenSymbol: item.token_symbol,
                        fromAddress: item.from_address,
                        toAddress: item.to_address,
                        tx_hash: item.transaction_hash,
                        block_timestamp: item.block_timestamp,
                        value_decimal: item.value_decimal,
                        usdPrice: usdPriceValue
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

    // create a function for a button to call an API to get the price of the token involved at the time of the transaction
    // This function should be a GET request that sends each transactions block_timestamp and symbol to the API.
    // The result of this request should then be added to the metadata object as usdPrice to be rendered below.
      

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
                <Table>
                    <TableCaption>A list of your Txs.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead className="text-right">Value</TableHead>
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
                                <TableCell className="text-right">
                                    {Number.isFinite(metaData.usdPrice) ? `$${metaData.usdPrice.toFixed(2)}` : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>Total Tx Value</TableCell>
                            <TableCell className="text-right">{formatDecimal(TxTotal())}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    );
};

export default TxDashboardTable;
