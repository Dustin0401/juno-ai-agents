export interface BacktestConfig {
  strategy: string;
  asset: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
}

export interface TradeSignal {
  timestamp: number;
  asset: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  reason?: string;
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  finalValue: number;
  volatility: number;
  var95: number;
  beta?: number;
  calmarRatio?: number;
  profitFactor?: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface EquityPoint {
  timestamp: number;
  value: number;
}

export interface BacktestOutput {
  summary: BacktestResult;
  trades: TradeSignal[];
  equityCurve: EquityPoint[];
}

class BacktestEngine {
  async runBacktest(
    config: BacktestConfig, 
    data: HistoricalDataPoint[], 
    onProgress?: (progress: number) => void
  ): Promise<BacktestOutput> {
    const trades: TradeSignal[] = [];
    const equityCurve: EquityPoint[] = [];
    let cash = config.initialCapital;
    let position = 0;
    let positionValue = 0;
    let maxEquity = config.initialCapital;
    let maxDrawdown = 0;

    // Technical indicators
    const sma20 = this.calculateSMA(data, 20);
    const sma50 = this.calculateSMA(data, 50);
    const rsi = this.calculateRSI(data, 14);
    const { upper: bbUpper, lower: bbLower } = this.calculateBollingerBands(data, 20, 2);

    // Strategy execution
    for (let i = 50; i < data.length; i++) {
      const current = data[i];
      const equity = cash + position * current.close;
      
      equityCurve.push({
        timestamp: current.timestamp,
        value: equity
      });

      // Update max drawdown
      if (equity > maxEquity) {
        maxEquity = equity;
      }
      const drawdown = ((maxEquity - equity) / maxEquity) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }

      // Strategy signals
      const signal = this.generateSignal(config.strategy, i, data, sma20, sma50, rsi, bbUpper, bbLower);
      
      if (signal && this.shouldExecuteTrade(signal, position)) {
        const trade = this.executeTrade(signal, current, position, cash, config.commission);
        
        if (trade) {
          trades.push(trade);
          
          if (signal.side === 'buy') {
            const quantity = (cash * 0.95) / current.close; // Use 95% of cash
            position += quantity;
            cash -= quantity * current.close * (1 + config.commission / 100);
          } else if (signal.side === 'sell' && position > 0) {
            cash += position * current.close * (1 - config.commission / 100);
            trade.pnl = (current.close - positionValue / position) * position;
            trade.pnlPercent = (trade.pnl / (positionValue || 1)) * 100;
            position = 0;
            positionValue = 0;
          }

          if (signal.side === 'buy') {
            positionValue = position * current.close;
          }
        }
      }

      // Update progress
      if (onProgress) {
        const progressPct = ((i - 50) / (data.length - 50)) * 100;
        onProgress(progressPct);
      }
    }

    // Close any remaining position
    if (position > 0) {
      const lastPrice = data[data.length - 1].close;
      cash += position * lastPrice * (1 - config.commission / 100);
      position = 0;
    }

    const finalValue = cash;
    const totalReturn = ((finalValue - config.initialCapital) / config.initialCapital) * 100;

    // Calculate performance metrics
    const summary = this.calculatePerformanceMetrics(
      trades,
      equityCurve,
      config.initialCapital,
      finalValue,
      totalReturn,
      maxDrawdown
    );

    return {
      summary,
      trades,
      equityCurve
    };
  }

  private generateSignal(
    strategy: string,
    index: number,
    data: HistoricalDataPoint[],
    sma20: number[],
    sma50: number[],
    rsi: number[],
    bbUpper: number[],
    bbLower: number[]
  ): { side: 'buy' | 'sell'; reason: string } | null {
    const current = data[index];
    const previous = data[index - 1];

    switch (strategy) {
      case 'sma-crossover':
        if (sma20[index] > sma50[index] && sma20[index - 1] <= sma50[index - 1]) {
          return { side: 'buy', reason: 'SMA20 crossed above SMA50' };
        }
        if (sma20[index] < sma50[index] && sma20[index - 1] >= sma50[index - 1]) {
          return { side: 'sell', reason: 'SMA20 crossed below SMA50' };
        }
        break;

      case 'rsi-oversold':
        if (rsi[index] < 30 && rsi[index - 1] >= 30) {
          return { side: 'buy', reason: 'RSI oversold condition' };
        }
        if (rsi[index] > 70 && rsi[index - 1] <= 70) {
          return { side: 'sell', reason: 'RSI overbought condition' };
        }
        break;

      case 'bollinger-bands':
        if (current.close <= bbLower[index] && previous.close > bbLower[index - 1]) {
          return { side: 'buy', reason: 'Price touched lower Bollinger Band' };
        }
        if (current.close >= bbUpper[index] && previous.close < bbUpper[index - 1]) {
          return { side: 'sell', reason: 'Price touched upper Bollinger Band' };
        }
        break;

      case 'momentum':
        const momentum = (current.close - data[index - 10].close) / data[index - 10].close;
        if (momentum > 0.05) {
          return { side: 'buy', reason: 'Strong upward momentum detected' };
        }
        if (momentum < -0.05) {
          return { side: 'sell', reason: 'Strong downward momentum detected' };
        }
        break;

      case 'macd-divergence':
        // Simplified MACD logic
        const ema12 = this.calculateEMA(data.slice(0, index + 1), 12);
        const ema26 = this.calculateEMA(data.slice(0, index + 1), 26);
        const macd = ema12[ema12.length - 1] - ema26[ema26.length - 1];
        const prevMacd = ema12[ema12.length - 2] - ema26[ema26.length - 2];
        
        if (macd > 0 && prevMacd <= 0) {
          return { side: 'buy', reason: 'MACD crossed above signal line' };
        }
        if (macd < 0 && prevMacd >= 0) {
          return { side: 'sell', reason: 'MACD crossed below signal line' };
        }
        break;
    }

    return null;
  }

  private shouldExecuteTrade(signal: { side: 'buy' | 'sell' }, position: number): boolean {
    if (signal.side === 'buy' && position === 0) return true;
    if (signal.side === 'sell' && position > 0) return true;
    return false;
  }

  private executeTrade(
    signal: { side: 'buy' | 'sell'; reason: string },
    current: HistoricalDataPoint,
    position: number,
    cash: number,
    commission: number
  ): TradeSignal | null {
    const quantity = signal.side === 'buy' ? (cash * 0.95) / current.close : position;
    
    if (quantity <= 0) return null;

    return {
      timestamp: current.timestamp,
      asset: 'BTC/USD', // This should come from config
      side: signal.side,
      price: current.close,
      quantity,
      pnl: 0, // Will be calculated later for sells
      pnlPercent: 0,
      reason: signal.reason
    };
  }

  private calculatePerformanceMetrics(
    trades: TradeSignal[],
    equityCurve: EquityPoint[],
    initialCapital: number,
    finalValue: number,
    totalReturn: number,
    maxDrawdown: number
  ): BacktestResult {
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const losingTrades = trades.filter(t => t.pnl < 0).length;
    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;

    // Calculate returns for Sharpe ratio
    const returns: number[] = [];
    for (let i = 1; i < equityCurve.length; i++) {
      const returnPct = (equityCurve[i].value - equityCurve[i - 1].value) / equityCurve[i - 1].value;
      returns.push(returnPct);
    }

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const volatility = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    ) * Math.sqrt(252) * 100; // Annualized

    const sharpeRatio = volatility > 0 ? (totalReturn / volatility) : 0;
    const var95 = this.calculateVaR(returns, 0.95) * 100;

    const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    const calmarRatio = maxDrawdown > 0 ? totalReturn / maxDrawdown : 0;

    return {
      totalReturn,
      sharpeRatio,
      maxDrawdown,
      winRate,
      totalTrades,
      winningTrades,
      losingTrades,
      avgWin,
      avgLoss,
      finalValue,
      volatility,
      var95,
      profitFactor,
      calmarRatio
    };
  }

  private calculateSMA(data: HistoricalDataPoint[], period: number): number[] {
    const sma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(0);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, point) => acc + point.close, 0);
        sma.push(sum / period);
      }
    }
    return sma;
  }

  private calculateEMA(data: HistoricalDataPoint[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(data[i].close);
      } else {
        ema.push((data[i].close - ema[i - 1]) * multiplier + ema[i - 1]);
      }
    }
    return ema;
  }

  private calculateRSI(data: HistoricalDataPoint[], period: number): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    for (let i = 0; i < gains.length; i++) {
      if (i < period - 1) {
        rsi.push(50);
      } else {
        const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }

    return [50, ...rsi]; // Add initial value
  }

  private calculateBollingerBands(data: HistoricalDataPoint[], period: number, stdDev: number): {
    upper: number[];
    lower: number[];
  } {
    const sma = this.calculateSMA(data, period);
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push(0);
        lower.push(0);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const variance = slice.reduce((acc, point) => acc + Math.pow(point.close - sma[i], 2), 0) / period;
        const standardDeviation = Math.sqrt(variance);
        
        upper.push(sma[i] + (standardDeviation * stdDev));
        lower.push(sma[i] - (standardDeviation * stdDev));
      }
    }

    return { upper, lower };
  }

  private calculateVaR(returns: number[], confidence: number): number {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return sortedReturns[index] || 0;
  }
}

export const backtestEngine = new BacktestEngine();