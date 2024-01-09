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

type TokenMetadata = {
    name: string;
    symbol: string;
    balance: number;
    logo: string;
};

const TokenDashboardTable = () => {
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState(''); // Added state to store the user entered address


    useEffect(() => {
        if (!address) return; // Do not fetch data if the address is not entered

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
    
            try {
                const response = await fetch('/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ address }) // Create an input form for the user to pick an address
                });
                console.log("This is the response: ", response)
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('API processed response:', data);

                const organizedData = data.combinedTokenData.map((item: any) => {
                    const balanceInDecimal = parseInt(item.balance, 16) / Math.pow(10, item.result.decimals);
                    return {
                        name: item.result.name,
                        symbol: item.result.symbol,
                        balance: balanceInDecimal,
                        logo: item.result.logo,
                    };
                });
    
                setTokenMetadata(organizedData);
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

    const tokenTotal = () => {
        return tokenMetadata.reduce((total, meta) => total + meta.balance, 0);
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
            <Button onClick={() => setAddress(address)}>Fetch Tokens</Button>
    
            {isLoading && (
                <Table>
                    <TableCaption>Waiting for address to find Tokens...</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead className="text-right">Units</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(1)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="w-[45px] h-[45px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="w-[60px] h-[20px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="w-[40px] h-[20px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="w-[80px] h-[20px] rounded-full" /></TableCell>
                                <TableCell className=''>
                                    <div className="flex justify-end">
                                        <Skeleton className="w-[80px] h-[20px] rounded-full" />
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
                    <TableCaption>A list of your tokens.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead className="text-right">Units</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokenMetadata.map((metaData, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <img
                                        src={metaData.logo}
                                        height={25}
                                        width={25}
                                        alt="Token Logo"
                                    />
                                </TableCell>
                                <TableCell>{metaData.name}</TableCell>
                                <TableCell>{metaData.symbol}</TableCell>
                                <TableCell className="text-right">{metaData.balance.toFixed(2)}</TableCell>
                                <TableCell>{metaData.symbol}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>Total Token Value</TableCell>
                            <TableCell className="text-right">{tokenTotal().toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    );    
};

export default TokenDashboardTable;
