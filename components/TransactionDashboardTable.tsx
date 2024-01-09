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
};

const TxDashboardTable = () => {
    const [TxMetadata, setTxMetadata] = useState<TxMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState(''); // Added state to store the user entered address


    useEffect(() => {
        if (!address) return; // Do not fetch data if the address is not entered

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
                    return {
                        tokenName: item.token_name,
                        tokenSymbol: item.token_symbol,
                        fromAddress: item.from_address,
                        toAddress: item.to_address,
                        tx_hash: item.transaction_hash,
                        block_timestamp: item.block_timestamp,
                        value_decimal: item.value_decimal,
                    };
                });
    
                setTxMetadata(organizedData);
            } catch (error) {
                console.error('Fetching error:', error);
                setError('Failed to load data');
            }
    
            setIsLoading(false);
        };
    
        fetchData();
    }, [address]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const TxTotal = () => {
        return TxMetadata.reduce((total, meta) => {
            const valueDecimal = typeof meta.value_decimal === 'string' ? parseFloat(meta.value_decimal) : meta.value_decimal;
            return total + valueDecimal;
        }, 0);
    };

    const formatAddress = (address: string) => {
        if (!address || address.length < 9) {
          return address; // Return the original address if it's too short to format
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
            return numericValue.toFixed(4); // 4 decimal places for values below 1
        } else {
            const formattedValue = numericValue.toFixed(3);
            return formattedValue.replace(/\.000$/, ''); // Remove trailing .000
        }
    };
      

    return (
        <div>
            <Input
                type="text"
                className='my-2'
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter Ethereum Address"
            />
            <Button onClick={() => setAddress(address)}>Fetch Txs</Button>
    
            {isLoading && (
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
                        {/* Assuming 5 columns based on your table structure */}
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
    
            {!isLoading && !error && (
                <Table>
                    <TableCaption>A list of your Txs.</TableCaption>
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
                        {TxMetadata.map((metaData, index) => (
                            <TableRow key={index}>
                                <TableCell>{metaData.tokenSymbol}</TableCell>
                                <TableCell>{formatAddress(metaData.fromAddress)}</TableCell>
                                <TableCell>{formatAddress(metaData.toAddress)}</TableCell>
                                <TableCell>{formatDate(metaData.block_timestamp)}</TableCell>
                                <TableCell className="text-right">{formatDecimal(metaData.value_decimal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>Total Tx Value</TableCell>
                            <TableCell className="text-right">{formatDecimal(TxTotal())}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    );
};

export default TxDashboardTable;
