"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { getWallets } from '@/libs/getWallets';
import { Check, ChevronsUpDown, CalendarDays, History, Loader2, Copy, CandlestickChart } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EthereumIcon from 'cryptocurrency-icons/svg/icon/eth.svg'
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';


type TxMetadata = {
    id: string;
    userId: string;
    wallet: string;
    address: string;
    tokenName: string;
    tokenSymbol: string;
    tokenLogo: string;
    fromAddress: string;
    toAddress: string;
    tx_hash: string;
    log_index: number;
    block_timestamp: string;
    value_decimal: number;
    usdPrice: number | null;
    historicalTokenPrice: number | null;
    salePrice: number | null;
    costBasis: number | null;
};

type WalletHolding = {
    id: string;
    userId: string;
    tokenSymbol: string;
    tokenAddress: string;
    value_decimal: number;
    currentPrice: number | null;
    avgHistoricalTokenPrice: number | null;
    walletAddress: string;
    walletName: string;
    holdingLogo: string;
}

const TxDashboardTable = () => {
    const { data: session } = useSession();
    const [TxMetadata, setTxMetadata] = useState<TxMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [wallets, setWallets] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [userTXs, setUserTXs] = useState<TxMetadata[]>([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [walletHoldings, setWalletHoldings] = useState<WalletHolding[]>([]);

    // GET REQUEST TO GET SAVED WALLETS
    useEffect(() => {
        const loadWallets = async () => {
            try {
                const result = await getWallets();
                setWallets(result.props.wallets);
                console.log("result.prop.wallets: ", result.props.wallets)
            } catch (err) {
                console.error("Failed to load wallets", err)
            }
        }
        
        const fetchUserTxs = async () => {
          if (session?.user?.id) {
            try {
              const response = await fetch(`/api/TX?userId=${session.user.id}`);
              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
              const data = await response.json();
              console.log("User Tx Data fetched: ", data);
              setUserTXs(data);
            } catch (err) {
              console.error("Failed to fetch user's TXs", err);
            }
          }
        };
        loadWallets();
        fetchUserTxs();
    }, [session]);

    // GROUP TRANSACTIONS BY WALLET
    const groupTransactionsByWallet = (transactions: TxMetadata[]) => {
        return transactions.reduce((acc: { [key: string]: TxMetadata[] }, tx) => {
          acc[tx.wallet] = acc[tx.wallet] || [];
          acc[tx.wallet].push(tx);
          return acc;
        }, {});
      };
    const groupedTXs = useMemo(() => groupTransactionsByWallet(userTXs), [userTXs]);


    // LIVE FETCHING THE TX DATA FOR A SPECIFIC WALLET
    useEffect(() => {
        if (!address) return; // This live fetching should set the wallet address to be rendered. Just like the handleAddress change is right now.

        const fetchTxData = async () => {
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
                console.log('API response:', data);

                const organizedData = data.map((item: any) => {
                    return {
                        wallet: address,
                        address: item.address,
                        tokenName: item.token_name,
                        tokenSymbol: item.token_symbol,
                        tokenLogo: item.token_logo,
                        fromAddress: item.from_address,
                        toAddress: item.to_address,
                        tx_hash: item.transaction_hash,
                        log_index: item.log_index,
                        block_timestamp: item.block_timestamp,
                        value_decimal: parseFloat(item.value_decimal),
                    };
                });
    
                Promise.all(organizedData).then((completedData) => {
                    setTxMetadata(completedData);
                });
                console.log("completed Data: ", organizedData)
            } catch (error) {
                console.error('Fetching error:', error);
                setError('Failed to load data');
            }
    
            setIsLoading(false);
        };
    
        fetchTxData();
    }, [address]);

    // CALCULATE WALLET HOLDING
    const calculateWalletHoldings = async (transactions: TxMetadata[]) => {
        const holdings: { [key: string]: WalletHolding } = {};

        transactions.forEach(tx => {
            const walletKey = `${tx.wallet}-${tx.tokenSymbol}`;

            if (!holdings[walletKey]) {
                holdings[walletKey] = {
                    id: '', 
                    userId: tx.userId,
                    tokenSymbol: tx.tokenSymbol,
                    tokenAddress: tx.address,
                    value_decimal: 0,
                    currentPrice: null, // Create this currentPrice below
                    avgHistoricalTokenPrice: null,
                    walletAddress: tx.wallet,
                    walletName: '', 
                    holdingLogo: tx.tokenLogo
                };
            }

            if (tx.wallet === tx.fromAddress) {
                holdings[walletKey].value_decimal -= tx.value_decimal;
            } else if (tx.wallet === tx.toAddress) {
                holdings[walletKey].value_decimal += tx.value_decimal;
            }
        });

        const filteredHoldings = Object.values(holdings).filter(holding => holding.value_decimal > 0.0001);

        try {
            // TODO: Generate the prices for the filtered holdings, and insert the price response into the currentPrice element
            const updatedHoldings = await updatePrices(filteredHoldings);
            console.log("Rendered Holdings with Prices: ", updatedHoldings);
            return updatedHoldings;
        } catch (error) {
            console.error("Error updating prices: ", error);
            // Return filtered holdings without updated prices in case of an error
            return filteredHoldings;
        }
    };

    useEffect(() => {
        const updateHoldings = async () => {
            const newWalletHoldings = await calculateWalletHoldings(TxMetadata);
            console.log("Rendered Wallet Holdings: ", newWalletHoldings)
            setWalletHoldings(newWalletHoldings);
        };
    
        updateHoldings();
    }, [TxMetadata]);


    const priceCache: { [key: string]: number } = {};

    const updatePrices = async (holdings: WalletHolding[]) => {
        return Promise.all(holdings.map(async (holding) => {
            const cacheKey = holding.tokenAddress;
            if (priceCache[cacheKey]) {
                return { ...holding, currentPrice: priceCache[cacheKey] };
            }
    
            try {
                const priceResponse = await fetch(`/api/tx/current-price?address=${encodeURIComponent(cacheKey)}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });
    
                if (!priceResponse.ok) {
                    throw new Error(`CP Error Fetching Price Data: ${priceResponse.status}`);
                }
    
                const priceBody = await priceResponse.json();
                const price = priceBody.priceJson.usdPrice;
                priceCache[cacheKey] = price; // Cache the price
                return { ...holding, currentPrice: price };
            } catch (error) {
                console.error(error);
                return holding; // return holding without updated price in case of an error
            }
        }));
    };


    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setAddress(inputValue);


        if (isValidEthereumAddress(inputValue)) {
            setSelectedWallet({ name: formatAddress(inputValue), wallet: inputValue });
            setIsSelectAll(false);
        } else if (inputValue === '') {
            setSelectedWallet(null);
            setIsSelectAll(false);
        }
    };

    const isValidEthereumAddress = (address: string) => {
        const re = /^0x[a-fA-F0-9]{40}$/;
        return re.test(address);
    };

    const handleTXSelection = (walletAddress: string, txs: TxMetadata[] = []) => {
        // It should also set when the user puts an address into the input, not just when the command area is used.
        setOpen(false);
        setIsLoading(false);
        setError(null);
    
        if (walletAddress === "select-all") {
            setIsSelectAll(true);
            setTxMetadata(userTXs);
            setSelectedWallet(null);
        } else {
            setIsSelectAll(false);
            setTxMetadata(userTXs.filter(tx => tx.wallet === walletAddress));
            const selected = wallets.find(w => w.wallet === walletAddress);
            setSelectedWallet(selected ? selected : { name: walletAddress, wallet: walletAddress });
        }
        setValue(walletAddress);
    };

    const TxTotal = () => {
        return TxMetadata.reduce((total, meta) => {
            const valueSalePrice = typeof meta.salePrice === 'string' ? parseFloat(meta.salePrice) : meta.salePrice;
            return total + valueSalePrice;
        }, 0);
    };

    const formatAddress = (address: string) => {
        if (!address || address.length < 9) {
          return address;
        }
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 3000);
        }).catch(err => {
            console.error('Error in copying text: ', err);
        });
    };
    
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      };

    const tableDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
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
    
    // FETCHING THE HISTORICAL TOKEN PRICES
    const fetchedPricesCache = useRef(new Map()).current;

    const fetchHistoricalTokenPrice = async (index: number, tokenSymbol: string, blockTimestamp: string, contractAddress: string ) => {
        try {
            if (tokenSymbol.toLowerCase() === 'usdc') {
                updateHistoricalPrice(index, 1);
                return;
            }

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

            const url = `/api/tx/historical-price?symbol=${encodeURIComponent(tokenSymbol)}&timestamp=${encodeURIComponent(blockTimestamp)}&contractAddress=${encodeURIComponent(contractAddress)}`;
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

    const HistoricalPriceButton = ({ index, tokenSymbol, blockTimestamp, contractAddress }: { index: number, tokenSymbol: string, blockTimestamp: string, contractAddress: string }) => (
        <Button variant='ghost' onClick={() => fetchHistoricalTokenPrice(index, tokenSymbol, blockTimestamp, contractAddress)}><History /></Button>
    );

    // FETCHING THE CURRENT TOKEN PRICE
    const fetchCurrentTokenPrice = async (index: number, address: string): Promise<number | null> => {
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
        <Button variant='secondary' onClick={() => fetchCurrentTokenPrice(index, address)}><CandlestickChart /></Button>
    );

    useEffect(() => {
        // Calculate new values for TxMetadata
        const newTxBasisOrSalePrice = TxMetadata.map(item => {
            let newItem = { ...item };
    
            if (typeof item.historicalTokenPrice === 'number' && item.wallet === item.fromAddress) {
                const salePrice = item.historicalTokenPrice * item.value_decimal;
                newItem.salePrice = salePrice;
            }
    
            if (typeof item.historicalTokenPrice === 'number' && item.wallet === item.toAddress) {
                const costBasis = item.historicalTokenPrice * item.value_decimal;
                newItem.costBasis = costBasis;
            }
    
            return newItem;
        });
    
        // Check if there are changes to update
        const hasChanges = newTxBasisOrSalePrice.some((item, index) => 
            item.salePrice !== TxMetadata[index].salePrice || 
            item.costBasis !== TxMetadata[index].costBasis
        );
    
        // Only update state if there are changes
        if (hasChanges) {
            setTxMetadata(newTxBasisOrSalePrice);
        }
    }, [TxMetadata]);

    // SAVE TX DATA
    const saveTxData = async () => {
        setIsSaving(true);
        
        if (!session?.user?.id) {
          console.error("User ID not found in session");
          return;
        }

        try {
          const response = await fetch('/api/TX', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: session.user.id,
              wallet: address,
              TxMetadata: TxMetadata,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("Result Message: ", result.message);
        toast.success('TX data saved successfully');
      } catch (err) {
        console.error('Failed to save TX data', err);
        toast.error('Failed to save TX data.')
      } finally {
        setIsSaving(false);
      }
    };


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

    const pieLabels = walletHoldings.map(holding => holding.tokenSymbol);
    const pieData = walletHoldings.map(holding => Number(holding.value_decimal) * holding.currentPrice || 0 );

    const pieChartData = {
        labels: pieLabels,
        datasets: [
          {
            label: 'Wallet Holdings',
            data: pieData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
          },
        ],
      };

      const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        // Additional options can be added here
      };


    return (
        <div>
            <div className='flex items-center'>
            <Input
                type="text"
                className='mr-2'
                value={address}
                onChange={handleAddressChange}
                placeholder="Paste Ethereum Address"
            />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between mr-2"
                    >
                        {selectedWallet ? selectedWallet.name : "Search Wallets..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search Wallets..." />
                            <CommandEmpty>No TX found</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    key="select-all"
                                    value="select-all"
                                    onSelect={() => {
                                    setValue("select-all");
                                    handleTXSelection("select-all");
                                }}
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${value === "select-all" ? "opacity-100" : "opacity-0"}`}
                                    />
                                    Select All
                                </CommandItem>
                                {Object.entries(groupedTXs).map(([walletAddress, txs]) => (
                                    <CommandItem
                                    key={walletAddress}
                                    value={walletAddress}
                                    onSelect={() => {
                                        setValue(walletAddress);
                                        handleTXSelection(walletAddress, txs);
                                    }}
                                    >
                                    <Check className={`mr-2 h-4 w-4 ${value === walletAddress ? "opacity-100" : "opacity-0"}`} />
                                    {wallets.find(w => w.wallet === walletAddress)?.name || formatAddress(walletAddress)}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <Separator className='my-4' />
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>
                            {isSelectAll ? "All Wallets Selected" : 
                            (selectedWallet ? selectedWallet.name : "No Wallet Name")}
                        </CardTitle>
                        <CardDescription>
                            {isSelectAll ? "" : 
                            (`Wallet Address: ${selectedWallet ? selectedWallet.wallet : "N/A"}`)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {walletHoldings.length > 0 ? (
                            <>
                                <div className="pie-chart-container" style={{ height: '300px' }}>
                                    <Pie data={pieChartData} options={pieChartOptions} />
                                </div>
                                {walletHoldings.map((holding, index) => (
                                    <div key={index}>
                                        <div className='flex items-center'>
                                            <img
                                                src={holding.holdingLogo}
                                                height='auto'
                                                width={25}
                                                className='mr-2'
                                            />
                                            <p>{holding.tokenSymbol}</p>
                                        </div>
                                        <div>
                                            <p>Address: {holding.tokenAddress}</p>
                                        </div>
                                        <div>
                                            <p>{holding.value_decimal}</p>
                                            <p>USD Price: {holding.currentPrice ? `$${holding.currentPrice.toFixed(2)}` : 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>No wallet holdings to display.</p>
                        )}
                    </CardContent>
                    <CardFooter>
                    <div className='w-full'>
                        {isSaving ? (
                            <Button disabled className='w-full'>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={saveTxData} className='w-full'>
                                Save Data
                            </Button>
                        )}
                    </div>
                    </CardFooter>
                </Card>
            <Separator className='my-4' />


            {isInputEmpty && (
                <div>Please enter an Ethereum address to fetch TXs.</div>
            )}
    
            {isLoading && !isInputEmpty && (
                <Table>
                    <TableCaption>Waiting for address to find Transactions...</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Price at Date</TableHead>
                            <TableHead>Basis</TableHead>
                            <TableHead>Sale Price</TableHead>
                            <TableHead className="text-right">FMV</TableHead>
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
                        <TableCaption>
                                <span>This Addresses TXs.</span>
                        </TableCaption>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Units</TableHead>
                                <TableHead>Price at Date</TableHead>
                                <TableHead>Basis</TableHead>
                                <TableHead>Sale Price</TableHead>
                                <TableHead className="text-right">FMV</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {TxMetadata.map((metaData, index) => {
                                let rowClass = '';
                                let badgeVariant = 'default'; 

                                if (metaData.toAddress === metaData.wallet) {
                                    rowClass = "hover:bg-green-600/20"; 
                                    badgeVariant = "inflow";
                                } else if (metaData.fromAddress === metaData.wallet) {
                                    rowClass = "hover:bg-rose-600/20"; 
                                    badgeVariant = "destructive"; 
                                }
                                return (
                                    <TableRow key={index} className={rowClass}>
                                        <TableCell>
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                <Button variant='link' style={{ marginLeft: '-14px' }}>
                                                    <img
                                                        src={metaData.tokenLogo || EthereumIcon}
                                                        height={25}
                                                        width={25}
                                                        className='mr-2'
                                                        alt={metaData.tokenName || 'Ethereum'}
                                                    />
                                                    {metaData.tokenSymbol}
                                                </Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80">
                                                <div className="space-y-1">
                                                    <div className="flex">
                                                        <h4 className="text-sm font-semibold mr-2">{metaData.tokenSymbol}</h4>
                                                        <button onClick={() => copyToClipboard(metaData.address, 'address')}>
                                                            {copiedId === 'address' ? <Check /> : <Copy />}
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm">From: {formatAddress(metaData.fromAddress)}</p>
                                                        <button onClick={() => copyToClipboard(metaData.fromAddress, 'from')}>
                                                            {copiedId === 'from' ? <Check /> : <Copy />}
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm">To: {formatAddress(metaData.toAddress)}</p>
                                                        <button onClick={() => copyToClipboard(metaData.toAddress, 'to')}>
                                                            {copiedId === 'to' ? <Check /> : <Copy />}
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm">Tx Hash: {formatAddress(metaData.tx_hash)}</p>
                                                        <button onClick={() => copyToClipboard(metaData.tx_hash, 'txHash')}>
                                                            {copiedId === 'txHash' ? <Check /> : <Copy />}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center pt-2">
                                                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(metaData.block_timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </TableCell>

                                        <TableCell>
                                            <div className='flex flex-col items-center' style={{ marginLeft: '-20px' }}>
                                            <Badge className='mb-2' variant={badgeVariant as any}>
                                                {badgeVariant === "destructive" ? "out" : badgeVariant === "inflow" ? "in" : ""}
                                            </Badge>
                                            <div className="flex items-center">
                                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                <span className="text-xs text-muted-foreground">
                                                    {tableDate(metaData.block_timestamp)}
                                                </span>
                                            </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDecimal(metaData.value_decimal)}</TableCell>
                                        <TableCell>
                                            {typeof metaData.historicalTokenPrice === 'number' ? (
                                                <div>${metaData.historicalTokenPrice.toFixed(2)}</div>
                                            ) : (
                                                <HistoricalPriceButton index={index} tokenSymbol={metaData.tokenSymbol} blockTimestamp={metaData.block_timestamp} contractAddress={metaData.address} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {typeof metaData.costBasis === 'number' ? (
                                                <div>${metaData.costBasis.toFixed(2)}</div>
                                            ) : (
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Button variant="link">
                                                            <div style={{ marginLeft: '-14px' }}>
                                                                <Skeleton className="w-[60px] h-[20px] rounded-full" />
                                                            </div>
                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-semibold">Generate Price at Date</h4>
                                                            <p className="text-sm">From: {formatAddress(metaData.fromAddress)}</p>
                                                            <p className="text-sm">To: {formatAddress(metaData.toAddress)}</p>
                                                            <div className="flex items-center pt-2">
                                                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(metaData.block_timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {typeof metaData.salePrice === 'number' ? (
                                                <div>${metaData.salePrice.toFixed(2)}</div>
                                            ) : (
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Button variant="link">
                                                        <Skeleton className="text-right w-[60px] h-[20px] rounded-full" />
                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-semibold">Generate Price at Date</h4>
                                                            <p className="text-sm">From: {formatAddress(metaData.fromAddress)}</p>
                                                            <p className="text-sm">To: {formatAddress(metaData.toAddress)}</p>
                                                            <div className="flex items-center pt-2">
                                                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(metaData.block_timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {typeof metaData.usdPrice === 'number' ? (
                                                <div>${metaData.usdPrice.toFixed(2)}</div>
                                            ) : (
                                                <CurrentPriceButton index={index} address={metaData.address} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4}>Total Tx Value</TableCell>
                                <TableCell colSpan={2}>Historical</TableCell>
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