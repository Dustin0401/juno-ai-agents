// AI-powered trading strategies and signals
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Zap,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'pending';
  signals: Signal[];
}

interface Signal {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  target: number;
  stopLoss: number;
  confidence: number;
  reasoning: string;
  timestamp: Date;
  strategy: string;
}

export const TradingStrategies = () => {
  const [activeStrategy, setActiveStrategy] = useState('momentum');

  const strategies: Strategy[] = [
    {
      id: 'momentum',
      name: 'AI Momentum Breakout',
      description: 'Multi-agent system identifying high-probability momentum breakouts',
      winRate: 68,
      avgReturn: 12.4,
      maxDrawdown: -8.2,
      timeframe: '4H-1D',
      riskLevel: 'medium',
      status: 'active',
      signals: [
        {
          id: 'signal-1',
          symbol: 'BTC',
          side: 'buy',
          price: 65420,
          target: 71200,
          stopLoss: 62800,
          confidence: 87,
          reasoning: 'Bullish breakout above key resistance with strong volume confirmation',
          timestamp: new Date(),
          strategy: 'momentum'
        },
        {
          id: 'signal-2',
          symbol: 'ETH',
          side: 'buy',
          price: 3240,
          target: 3580,
          stopLoss: 3120,
          confidence: 73,
          reasoning: 'Technical divergence pattern + positive sentiment shift',
          timestamp: new Date(Date.now() - 3600000),
          strategy: 'momentum'
        }
      ]
    },
    {
      id: 'mean-reversion',
      name: 'Smart Mean Reversion',
      description: 'Identifies oversold conditions with high reversal probability',
      winRate: 74,
      avgReturn: 8.9,
      maxDrawdown: -5.1,
      timeframe: '1H-4H',
      riskLevel: 'low',
      status: 'active',
      signals: [
        {
          id: 'signal-3',
          symbol: 'SOL',
          side: 'buy',
          price: 142,
          target: 158,
          stopLoss: 136,
          confidence: 91,
          reasoning: 'Oversold RSI with bullish on-chain metrics divergence',
          timestamp: new Date(Date.now() - 7200000),
          strategy: 'mean-reversion'
        }
      ]
    },
    {
      id: 'swing',
      name: 'Multi-Timeframe Swing',
      description: 'Captures medium-term swings using multi-agent confluence',
      winRate: 61,
      avgReturn: 18.7,
      maxDrawdown: -12.4,
      timeframe: '1D-1W',
      riskLevel: 'high',
      status: 'pending',
      signals: []
    }
  ];

  const currentStrategy = strategies.find(s => s.id === activeStrategy) || strategies[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-terminal-green';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-terminal-red';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-terminal-green/20 text-terminal-green border-terminal-green/30';
      case 'paused': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const calculateRR = (entry: number, target: number, stopLoss: number) => {
    const profit = Math.abs(target - entry);
    const risk = Math.abs(entry - stopLoss);
    return (profit / risk).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <Card 
            key={strategy.id}
            className={`cursor-pointer transition-all hover:border-lime/30 ${
              activeStrategy === strategy.id ? 'border-lime/50 bg-lime/5' : 'bg-surface border-border'
            }`}
            onClick={() => setActiveStrategy(strategy.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{strategy.name}</CardTitle>
                <Badge className={getStatusColor(strategy.status)}>
                  {strategy.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                {strategy.description}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Win Rate:</span>
                  <div className="font-mono text-terminal-green">{strategy.winRate}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Return:</span>
                  <div className="font-mono text-terminal-green">+{strategy.avgReturn}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max DD:</span>
                  <div className="font-mono text-terminal-red">{strategy.maxDrawdown}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk:</span>
                  <div className={`font-mono capitalize ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Strategy Details */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-lime" />
              {currentStrategy.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(currentStrategy.status)}>
                {currentStrategy.status}
              </Badge>
              <Button size="sm" variant="outline" className="hover:bg-lime/10">
                <BarChart3 className="w-4 h-4 mr-2" />
                Backtest
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-background rounded-xl">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-2xl font-mono font-semibold text-terminal-green">
                {currentStrategy.winRate}%
              </div>
              <Progress value={currentStrategy.winRate} className="mt-2 h-1" />
            </div>
            <div className="text-center p-3 bg-background rounded-xl">
              <div className="text-sm text-muted-foreground">Avg Return</div>
              <div className="text-2xl font-mono font-semibold text-terminal-green">
                +{currentStrategy.avgReturn}%
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-xl">
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
              <div className="text-2xl font-mono font-semibold text-terminal-red">
                {currentStrategy.maxDrawdown}%
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-xl">
              <div className="text-sm text-muted-foreground">Timeframe</div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                {currentStrategy.timeframe}
              </div>
            </div>
          </div>

          {/* Active Signals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Signals</h3>
              <Badge variant="outline" className="text-lime border-lime/30">
                {currentStrategy.signals.length} signals
              </Badge>
            </div>

            {currentStrategy.signals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No active signals</p>
                <p className="text-xs mt-1">Waiting for high-confidence setups</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentStrategy.signals.map((signal) => (
                  <Card key={signal.id} className="bg-background border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            signal.side === 'buy' ? 'bg-terminal-green/20' : 'bg-terminal-red/20'
                          }`}>
                            {signal.side === 'buy' ? 
                              <TrendingUp className="w-4 h-4 text-terminal-green" /> :
                              <TrendingDown className="w-4 h-4 text-terminal-red" />
                            }
                          </div>
                          <div>
                            <div className="font-mono font-semibold text-lg">
                              {signal.side.toUpperCase()} {signal.symbol}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {signal.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className="bg-lime/20 text-lime border-lime/30 mb-2">
                            {signal.confidence}% confidence
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            R/R: {calculateRR(signal.price, signal.target, signal.stopLoss)}:1
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Entry</div>
                          <div className="font-mono text-sm">${signal.price.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Target</div>
                          <div className="font-mono text-sm text-terminal-green">
                            ${signal.target.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Stop Loss</div>
                          <div className="font-mono text-sm text-terminal-red">
                            ${signal.stopLoss.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-surface rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">AI Reasoning</div>
                        <p className="text-sm">{signal.reasoning}</p>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="btn-lime flex-1">
                          Execute Trade
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-lime/10">
                          Paper Trade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};