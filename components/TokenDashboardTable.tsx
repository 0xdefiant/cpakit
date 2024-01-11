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
import BigNumber from 'bignumber.js';

type TokenMetadata = {
    name: string;
    symbol: string;
    decimals: number;
    balance: number;
    usdPrice: number;
    usdPriceFormatted: string;
    usdValue: number;
    usdValueFormatted: string;
    tokenAddress: string;
    logo: string;
};

const TokenDashboardTable = () => {
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState(''); // Added state to store the user entered address


    useEffect(() => {
        if (!address) return; // Do not fetch data if the address is not entered

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
    
            try {
                const response = await fetch(`/api/token?address=${address}`, {
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

                const organizedData = data.combinedData.map((item: any) => {
                    const humanReadableBalance = new BigNumber(item.balance).dividedBy(new BigNumber(10).pow(item.decimals)).toFixed(3).toString();
                    console.log("Human Readabale Balance: ", humanReadableBalance)
                    const usdValue = Number(humanReadableBalance) * item.priceInfo.usdPrice;
                    console.log("USD Value: ", usdValue)
                    const usdValueFormatted = usdValue.toFixed(2).toString();
                    const usdPriceFormatted = item.priceInfo.usdPrice.toFixed(2).toString();
                    return {
                        name: item.name,
                        symbol: item.symbol,
                        decimals: item.decimals,
                        balance: humanReadableBalance,
                        usdPrice: item.priceInfo.usdPrice,
                        usdPriceFormatted: usdPriceFormatted,
                        usdValue: usdValue.toFixed(2).toString(),
                        usdValueFormatted: usdValueFormatted,
                        tokenAddress: item.token_address,
                        logo: item.logo,
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
        const inputValue = e.target.value;
        setAddress(inputValue);
        setIsInputEmpty(inputValue === '');
    };

    const TokenTotal = () => {
        if (!tokenMetadata || tokenMetadata.length === 0) {
            return '0'; // Return '0' or some placeholder if data is empty or not loaded
        }
    
        const totalValue = tokenMetadata.reduce((total, meta) => {
            const valueBigNumber = new BigNumber(meta.usdValue); 
            return total.plus(valueBigNumber); 
        }, new BigNumber(0));
    
        // Example formatting: rounding to 2 decimal places
        return totalValue.toFixed(2).toString();
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
            <Button onClick={() => setAddress(address)}>Fetch Tokens</Button>
            </div>

            {isInputEmpty && (
                <div>Please enter an Ethereum address to fetch NFTs.</div>
            )}
    
            {isLoading && !isInputEmpty && (
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
    
            {!isLoading && !error && !isInputEmpty && (
                <Table>
                    <TableCaption>A list of your tokens.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">USD Value</TableHead>
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
                                <TableCell>{metaData.balance}</TableCell>
                                <TableCell>$ {metaData.usdPriceFormatted}</TableCell>
                                <TableCell className="text-right">$ {metaData.usdValueFormatted}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>Total Token Value</TableCell>
                            <TableCell className="text-right">{TokenTotal()}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    );    
};

export default TokenDashboardTable;
