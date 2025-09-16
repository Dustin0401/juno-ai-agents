import { useState, useCallback } from 'react';
import { BacktestConfig, BacktestResult, TradeSignal, backtestEngine } from '@/lib/backtesting';
import { generateHistoricalData } from '@/lib/market-data';

interface EquityPoint {
  date: string;
  value: number;
}

export const useBacktestEngine = () => {
  const [config, setConfig] = useState<BacktestConfig>({
    strategy: 'sma-crossover',
    asset: 'BTC/USD',
    timeframe: '1h',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    initialCapital: 10000,
    commission: 0.1
  });

  const [result, setResult] = useState<BacktestResult | null>(null);
  const [trades, setTrades] = useState<TradeSignal[]>([]);
  const [equityCurve, setEquityCurve] = useState<EquityPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateConfig = useCallback((updates: Partial<BacktestConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const runBacktest = useCallback(async () => {
    if (!config.asset || !config.strategy) {
      throw new Error('Please configure asset and strategy');
    }

    setIsRunning(true);
    setProgress(0);
    setResult(null);
    setTrades([]);
    setEquityCurve([]);

    try {
      // Generate historical data
      const historicalData = generateHistoricalData(
        config.asset,
        config.startDate,
        config.endDate,
        config.timeframe
      );

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10, 90));
      }, 100);

      // Run backtest engine
      const backtestResult = await backtestEngine.runBacktest(config, historicalData, (progress) => {
        setProgress(progress);
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Set results
      setResult(backtestResult.summary);
      setTrades(backtestResult.trades);
      setEquityCurve(backtestResult.equityCurve.map(point => ({
        date: new Date(point.timestamp).toLocaleDateString(),
        value: point.value
      })));

      // Small delay to show completion
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      setIsRunning(false);
      setProgress(0);
      throw error;
    }
  }, [config]);

  const stopBacktest = useCallback(() => {
    setIsRunning(false);
    setProgress(0);
  }, []);

  return {
    config,
    updateConfig,
    result,
    trades,
    equityCurve,
    isRunning,
    progress,
    runBacktest,
    stopBacktest
  };
};