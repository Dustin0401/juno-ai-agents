// Paper Trading Modal Component
// Simulate trades with position sizing and risk management

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketAnalysis {
  asset: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  conviction: number;
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  riskReward: number;
}

interface PaperTradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: MarketAnalysis | null;
}

export const PaperTradingModal = ({ isOpen, onClose, analysis }: PaperTradingModalProps) => {
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [size, setSize] = useState([1]); // Percentage of portfolio
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [timeHorizon, setTimeHorizon] = useState<'intraday' | 'swing' | 'position'>('swing');
  const { toast } = useToast();

  // Mock portfolio values
  const portfolioValue = 50000; // $50k mock portfolio
  const positionSize = (size[0] / 100) * portfolioValue;
  const currentPrice = analysis?.asset === 'BTC' ? 65000 : 
                      analysis?.asset === 'ETH' ? 3200 : 150;

  // Calculate position metrics
  const entry = parseFloat(entryPrice) || currentPrice;
  const stop = parseFloat(stopLoss) || 0;
  const tp = parseFloat(takeProfit) || 0;
  
  const riskAmount = stop ? Math.abs(entry - stop) * (positionSize / entry) : 0;
  const rewardAmount = tp ? Math.abs(tp - entry) * (positionSize / entry) : 0;
  const riskReward = riskAmount > 0 ? rewardAmount / riskAmount : 0;
  const riskPercent = (riskAmount / portfolioValue) * 100;

  // Auto-populate levels from analysis
  useEffect(() => {
    if (analysis && isOpen) {
      setPosition(analysis.bias === 'bearish' ? 'short' : 'long');
      
      if (analysis.bias === 'bullish') {
        setEntryPrice(analysis.keyLevels.support[0]?.toString() || '');
        setStopLoss(analysis.keyLevels.support[1]?.toString() || '');
        setTakeProfit(analysis.keyLevels.resistance[0]?.toString() || '');
      } else if (analysis.bias === 'bearish') {
        setEntryPrice(analysis.keyLevels.resistance[0]?.toString() || '');
        setStopLoss(analysis.keyLevels.resistance[1]?.toString() || '');
        setTakeProfit(analysis.keyLevels.support[0]?.toString() || '');
      } else {
        setEntryPrice(currentPrice.toString());
      }
    }
  }, [analysis, isOpen, currentPrice]);

  const handleSimulateTrade = () => {
    // Validation
    if (!entryPrice || !stopLoss) {
      toast({
        title: "Missing required fields",
        description: "Please enter entry price and stop loss",
        variant: "destructive"
      });
      return;
    }

    if (riskPercent > 5) {
      toast({
        title: "Risk too high",
        description: "Position risk exceeds 5% of portfolio. Consider reducing size.",
        variant: "destructive"
      });
      return;
    }

    // Create paper trade
    const trade = {
      id: `trade_${Date.now()}`,
      asset: analysis?.asset || 'BTC',
      position,
      orderType,
      entryPrice: entry,
      stopLoss: stop,
      takeProfit: tp,
      size: positionSize,
      riskAmount,
      rewardAmount,
      riskReward,
      timeHorizon,
      timestamp: new Date(),
      status: 'open'
    };

    // Save to localStorage (in production, send to backend)
    const existingTrades = JSON.parse(localStorage.getItem('paperTrades') || '[]');
    existingTrades.push(trade);
    localStorage.setItem('paperTrades', JSON.stringify(existingTrades));

    toast({
      title: "Paper trade created",
      description: `${position.toUpperCase()} ${trade.asset} position simulated successfully`
    });

    onClose();
  };

  if (!analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Paper Trade Simulator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Analysis Summary: {analysis.asset}
                <Badge 
                  variant="outline"
                  className={`${
                    analysis.bias === 'bullish' ? 'border-terminal-green/30 text-terminal-green' :
                    analysis.bias === 'bearish' ? 'border-terminal-red/30 text-terminal-red' :
                    'border-terminal-amber/30 text-terminal-amber'
                  }`}
                >
                  {analysis.bias} • {analysis.conviction}% conviction
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>Support: ${analysis.keyLevels.support.map(s => s.toLocaleString()).join(', ')}</div>
              <div>Resistance: ${analysis.keyLevels.resistance.map(r => r.toLocaleString()).join(', ')}</div>
              <div>Expected R:R: {analysis.riskReward.toFixed(1)}:1</div>
            </CardContent>
          </Card>

          {/* Position Setup */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Position Type</Label>
                <Select value={position} onValueChange={(v: 'long' | 'short') => setPosition(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-terminal-green" />
                        Long (Buy)
                      </div>
                    </SelectItem>
                    <SelectItem value="short">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-terminal-red" />
                        Short (Sell)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={(v: 'market' | 'limit') => setOrderType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Time Horizon</Label>
                <Select value={timeHorizon} onValueChange={(v: any) => setTimeHorizon(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intraday">Intraday (&lt; 1 day)</SelectItem>
                    <SelectItem value="swing">Swing (1-7 days)</SelectItem>
                    <SelectItem value="position">Position (&gt; 1 week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Entry Price ($)</Label>
                <Input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder={`Current: $${currentPrice.toLocaleString()}`}
                />
              </div>

              <div>
                <Label>Stop Loss ($)</Label>
                <Input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Risk management level"
                />
              </div>

              <div>
                <Label>Take Profit ($) - Optional</Label>
                <Input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="Target exit level"
                />
              </div>
            </div>
          </div>

          {/* Position Sizing */}
          <div className="space-y-3">
            <Label>Position Size: {size[0]}% of portfolio</Label>
            <Slider
              value={size}
              onValueChange={setSize}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Max recommended: 5% per position
            </div>
          </div>

          <Separator />

          {/* Risk Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Position Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Position Value</div>
                <div className="font-mono text-lg">${positionSize.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Risk Amount</div>
                <div className={`font-mono text-lg ${riskPercent > 3 ? 'text-terminal-red' : 'text-terminal-amber'}`}>
                  ${riskAmount.toFixed(0)} ({riskPercent.toFixed(1)}%)
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Risk:Reward</div>
                <div className={`font-mono text-lg ${riskReward >= 2 ? 'text-terminal-green' : 'text-terminal-amber'}`}>
                  {riskReward.toFixed(1)}:1
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Warnings */}
          {riskPercent > 5 && (
            <Card className="border-terminal-red/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-terminal-red text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  High risk: Position exceeds 5% portfolio risk limit
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSimulateTrade}
              className="flex-1 btn-lime"
              disabled={!entryPrice || !stopLoss}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Simulate Trade
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Paper trading only. No real money at risk.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};