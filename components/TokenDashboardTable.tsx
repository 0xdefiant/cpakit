'use client'

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
import Image from "next/image";
import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
    
            try {
                const response = await fetch('/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ address: "0xf15Ffd776A3981b0Cd9f9401df455fCB7dEf8e1A" }) // Properly structured JSON
                });
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('API response:', data);

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
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const tokenTotal = () => {
        return tokenMetadata.reduce((total, meta) => total + meta.balance, 0);
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your tokens.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokenMetadata.map((metaData, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <img
                                    src={metaData.logo}
                                    height={70}
                                    width={70}
                                    alt="Token Logo"
                                />
                            </TableCell>
                            <TableCell>{metaData.name}</TableCell>
                            <TableCell>{metaData.symbol}</TableCell>
                            <TableCell className="text-right">{metaData.balance.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total Token Value</TableCell>
                        <TableCell className="text-right">{tokenTotal().toFixed(2)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default TokenDashboardTable;
