import { HistoricalDataPoint } from './backtesting';

export const generateHistoricalData = (
  asset: string,
  startDate: string,
  endDate: string,
  timeframe: string
): HistoricalDataPoint[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: HistoricalDataPoint[] = [];

  // Define timeframe intervals in milliseconds
  const intervals: Record<string, number> = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000
  };

  const interval = intervals[timeframe] || intervals['1h'];
  
  // Base prices for different assets
  const basePrices: Record<string, number> = {
    'BTC/USD': 45000,
    'ETH/USD': 2800,
    'SOL/USD': 120,
    'AVAX/USD': 28,
    'LINK/USD': 12,
    'UNI/USD': 6,
    'AAVE/USD': 85
  };

  let currentPrice = basePrices[asset] || 45000;
  let currentTime = start.getTime();
  
  // Add trend and volatility parameters
  const trendStrength = (Math.random() - 0.5) * 0.0001; // Small trend
  const volatility = 0.02; // 2% volatility

  while (currentTime <= end.getTime()) {
    // Generate OHLC data with realistic price movements
    const open = currentPrice;
    
    // Add trend
    currentPrice += currentPrice * trendStrength;
    
    // Add random walk with volatility
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice += change;
    
    // Generate intrabar movements
    const high = open + Math.abs(change) + (Math.random() * 0.01 * currentPrice);
    const low = open - Math.abs(change) - (Math.random() * 0.01 * currentPrice);
    const close = currentPrice;
    
    // Ensure OHLC relationships are valid
    const validHigh = Math.max(open, high, low, close);
    const validLow = Math.min(open, high, low, close);
    
    const volume = Math.random() * 1000000 + 100000; // Random volume

    data.push({
      timestamp: currentTime,
      open,
      high: validHigh,
      low: validLow,
      close,
      volume
    });

    currentTime += interval;
  }

  return data;
};