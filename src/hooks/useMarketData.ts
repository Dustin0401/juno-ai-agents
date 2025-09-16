// Real-time market data simulation hook
import { useState, useEffect, useCallback } from 'react';
import { safeGetItem } from '@/lib/storage';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: Date;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  quantity: number;
  avgEntry: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: Date;
}

const MOCK_ASSETS = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'UNI', 'AAVE'];

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [totalPnL, setTotalPnL] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time price updates
  const generateMockPrice = useCallback((symbol: string, basePrice: number) => {
    const volatility = Math.random() * 0.02 - 0.01; // ±1% volatility
    const change24h = Math.random() * 0.2 - 0.1; // ±10% daily change
    
    return {
      symbol,
      price: basePrice * (1 + volatility),
      change24h: change24h * basePrice,
      changePercent: change24h * 100,
      volume: Math.random() * 1000000000 + 100000000, // 100M - 1B volume
      marketCap: Math.random() * 100000000000 + 10000000000, // 10B - 100B market cap
      timestamp: new Date()
    };
  }, []);

  // Initialize market data
  useEffect(() => {
    const basePrices = {
      BTC: 65000,
      ETH: 3200,
      SOL: 150,
      AVAX: 35,
      LINK: 14,
      UNI: 8,
      AAVE: 90
    };

    const initialData: Record<string, MarketData> = {};
    MOCK_ASSETS.forEach(symbol => {
      initialData[symbol] = generateMockPrice(symbol, basePrices[symbol as keyof typeof basePrices]);
    });

    setMarketData(initialData);
    setIsConnected(true);
  }, [generateMockPrice]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        
        // Update 1-2 random assets each tick
        const assetsToUpdate = MOCK_ASSETS.slice(0, Math.ceil(Math.random() * 2) + 1);
        
        assetsToUpdate.forEach(symbol => {
          if (updated[symbol]) {
            const basePrice = symbol === 'BTC' ? 65000 : 
                            symbol === 'ETH' ? 3200 : 
                            symbol === 'SOL' ? 150 :
                            symbol === 'AVAX' ? 35 :
                            symbol === 'LINK' ? 14 :
                            symbol === 'UNI' ? 8 : 90;
            
            updated[symbol] = generateMockPrice(symbol, basePrice);
          }
        });

        return updated;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isConnected, generateMockPrice]);

  // Load portfolio from paper trades
  useEffect(() => {
    const loadPortfolio = () => {
      const paperTrades = JSON.parse(safeGetItem('paperTrades') || '[]');
      const openTrades = paperTrades.filter((trade: any) => trade.status === 'open');
      
      const positions: PortfolioPosition[] = openTrades.map((trade: any) => {
        const currentPrice = marketData[trade.asset]?.price || trade.entryPrice;
        const pnl = trade.position === 'long' 
          ? (currentPrice - trade.entryPrice) * (trade.size / trade.entryPrice)
          : (trade.entryPrice - currentPrice) * (trade.size / trade.entryPrice);
        
        return {
          id: trade.id,
          symbol: trade.asset,
          quantity: trade.size / trade.entryPrice,
          avgEntry: trade.entryPrice,
          currentPrice,
          pnl,
          pnlPercent: (pnl / trade.size) * 100,
          timestamp: new Date(trade.timestamp)
        };
      });

      setPortfolio(positions);
      setTotalPnL(positions.reduce((sum, pos) => sum + pos.pnl, 0));
    };

    if (Object.keys(marketData).length > 0) {
      loadPortfolio();
    }
  }, [marketData]);

  const getAssetData = (symbol: string) => marketData[symbol] || null;
  
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return {
    marketData,
    portfolio,
    totalPnL,
    isConnected,
    getAssetData,
    formatPrice,
    formatChange,
    refresh: () => setIsConnected(prev => !prev)
  };
};