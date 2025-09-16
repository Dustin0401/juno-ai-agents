import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Square, TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useBacktestEngine } from '@/hooks/useBacktestEngine';
import { BacktestConfig, BacktestResult, TradeSignal } from '@/lib/backtesting';
import { toast } from 'sonner';

const Backtest = () => {
  const navigate = useNavigate();
  const {
    config,
    updateConfig,
    result,
    isRunning,
    progress,
    runBacktest,
    stopBacktest,
    trades,
    equityCurve
  } = useBacktestEngine();

  const [selectedStrategy, setSelectedStrategy] = useState('sma-crossover');

  const strategies = [
    { id: 'sma-crossover', name: 'SMA Crossover', description: 'Simple Moving Average crossover strategy' },
    { id: 'rsi-oversold', name: 'RSI Oversold', description: 'Buy when RSI < 30, sell when RSI > 70' },
    { id: 'bollinger-bands', name: 'Bollinger Bands', description: 'Mean reversion using Bollinger Bands' },
    { id: 'macd-divergence', name: 'MACD Divergence', description: 'MACD signal line crossover strategy' },
    { id: 'momentum', name: 'Momentum', description: 'Price momentum based strategy' }
  ];

  const assets = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'AVAX/USD', 'LINK/USD', 'UNI/USD', 'AAVE/USD'];
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

  const handleRunBacktest = async () => {
    try {
      await runBacktest();
      toast.success('Backtest completed successfully!');
    } catch (error) {
      toast.error('Backtest failed. Please check your configuration.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Research
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Strategy Backtester</h1>
                <p className="text-sm text-muted-foreground">Test your trading strategies with historical data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Button variant="destructive" size="sm" onClick={stopBacktest}>
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button onClick={handleRunBacktest} disabled={!config.asset || !config.strategy}>
                  <Play className="w-4 h-4 mr-2" />
                  Run Backtest
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Strategy Configuration
                </CardTitle>
                <CardDescription>Configure your backtesting parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Strategy Selection */}
                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select
                    value={config.strategy}
                    onValueChange={(value) => updateConfig({ strategy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          <div>
                            <div className="font-medium">{strategy.name}</div>
                            <div className="text-xs text-muted-foreground">{strategy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Asset Selection */}
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select
                    value={config.asset}
                    onValueChange={(value) => updateConfig({ asset: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset} value={asset}>
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeframe */}
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Select
                    value={config.timeframe}
                    onValueChange={(value) => updateConfig({ timeframe: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((tf) => (
                        <SelectItem key={tf} value={tf}>
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={config.startDate}
                      onChange={(e) => updateConfig({ startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={config.endDate}
                      onChange={(e) => updateConfig({ endDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Capital */}
                <div className="space-y-2">
                  <Label>Initial Capital</Label>
                  <Input
                    type="number"
                    value={config.initialCapital}
                    onChange={(e) => updateConfig({ initialCapital: Number(e.target.value) })}
                    placeholder="Enter initial capital"
                  />
                </div>

                {/* Commission */}
                <div className="space-y-2">
                  <Label>Commission (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={config.commission}
                    onChange={(e) => updateConfig({ commission: Number(e.target.value) })}
                    placeholder="Enter commission rate"
                  />
                </div>

                {/* Progress */}
                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Running backtest...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
                <TabsTrigger value="equity">Equity Curve</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {result ? (
                  <>
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Total Return</span>
                          </div>
                          <div className="text-2xl font-bold text-green-500">
                            {formatPercentage(result.totalReturn)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(result.finalValue)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Sharpe Ratio</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {result.sharpeRatio.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Risk-adjusted return
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Max Drawdown</span>
                          </div>
                          <div className="text-2xl font-bold text-red-500">
                            {formatPercentage(result.maxDrawdown)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Worst peak-to-trough
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium">Win Rate</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {formatPercentage(result.winRate)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.totalTrades} total trades
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Equity Curve Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Value Over Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={equityCurve}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="date" 
                                className="text-xs fill-muted-foreground"
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                className="text-xs fill-muted-foreground"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatCurrency(value)}
                              />
                              <Tooltip
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                        <p className="font-medium">{label}</p>
                                        <p className="text-green-500">
                                          Value: {formatCurrency(payload[0].value as number)}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.1}
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Configure your strategy and run a backtest to see results
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="trades" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trade History</CardTitle>
                    <CardDescription>
                      {trades.length} trades executed during backtest
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {trades.length > 0 ? (
                      <div className="space-y-4">
                        {trades.slice(0, 10).map((trade, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-4">
                              <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                                {trade.side.toUpperCase()}
                              </Badge>
                              <div>
                                <div className="font-medium">{trade.asset}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(trade.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(trade.price)}</div>
                              <div className="text-sm text-muted-foreground">
                                {trade.quantity.toFixed(4)} units
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatPercentage(trade.pnlPercent)}
                              </div>
                            </div>
                          </div>
                        ))}
                        {trades.length > 10 && (
                          <div className="text-center text-muted-foreground">
                            ... and {trades.length - 10} more trades
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No trades to display</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Equity Curve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={equityCurve}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="date" 
                            className="text-xs fill-muted-foreground"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            className="text-xs fill-muted-foreground"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-primary">
                                      Value: {formatCurrency(payload[0].value as number)}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result && (
                        <>
                          <div className="flex justify-between">
                            <span>Volatility</span>
                            <span className="font-medium">{formatPercentage(result.volatility)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Value at Risk (95%)</span>
                            <span className="font-medium text-red-500">{formatPercentage(result.var95)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Beta</span>
                            <span className="font-medium">{result.beta?.toFixed(2) || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Calmar Ratio</span>
                            <span className="font-medium">{result.calmarRatio?.toFixed(2) || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Trade Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result && (
                        <>
                          <div className="flex justify-between">
                            <span>Total Trades</span>
                            <span className="font-medium">{result.totalTrades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Winning Trades</span>
                            <span className="font-medium text-green-500">{result.winningTrades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Losing Trades</span>
                            <span className="font-medium text-red-500">{result.losingTrades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Win</span>
                            <span className="font-medium text-green-500">{formatCurrency(result.avgWin)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Loss</span>
                            <span className="font-medium text-red-500">{formatCurrency(result.avgLoss)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Profit Factor</span>
                            <span className="font-medium">{result.profitFactor?.toFixed(2) || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backtest;