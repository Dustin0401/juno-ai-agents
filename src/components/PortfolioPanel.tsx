// Portfolio management panel with real-time P&L tracking
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Activity,
  DollarSign,
  Target,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

export const PortfolioPanel = () => {
  const { 
    marketData, 
    portfolio, 
    totalPnL, 
    isConnected, 
    formatPrice, 
    formatChange, 
    refresh 
  } = useMarketData();
  
  const [activeTab, setActiveTab] = useState('positions');
  
  const portfolioValue = 50000; // Mock $50k portfolio
  const totalValue = portfolioValue + totalPnL;
  const returnPercent = (totalPnL / portfolioValue) * 100;

  const topMovers = Object.values(marketData)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="bg-surface border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-lime" />
              Portfolio Overview
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              disabled={!isConnected}
              className="hover:bg-lime/10"
            >
              <RefreshCw className={`w-4 h-4 ${!isConnected ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-mono font-semibold">
                {formatPrice(totalValue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">P&L Today</div>
              <div className={`text-2xl font-mono font-semibold ${
                totalPnL >= 0 ? 'text-terminal-green' : 'text-terminal-red'
              }`}>
                {totalPnL >= 0 ? '+' : ''}{formatPrice(totalPnL)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Return</div>
              <div className={`text-2xl font-mono font-semibold ${
                returnPercent >= 0 ? 'text-terminal-green' : 'text-terminal-red'
              }`}>
                {formatChange(returnPercent)}
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-terminal-green animate-pulse' : 'bg-terminal-red'
            }`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Live data' : 'Disconnected'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface">
          <TabsTrigger value="positions" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
            Positions
          </TabsTrigger>
          <TabsTrigger value="markets" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
            Markets
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
            History
          </TabsTrigger>
        </TabsList>

        {/* Open Positions */}
        <TabsContent value="positions" className="mt-4">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-4 h-4" />
                Open Positions ({portfolio.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No open positions</p>
                  <p className="text-xs mt-1">Use paper trading to simulate trades</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((position) => (
                    <div key={position.id} className="p-3 bg-background rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{position.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {position.quantity.toFixed(6)} units
                          </Badge>
                        </div>
                        <div className={`font-mono text-sm ${
                          position.pnl >= 0 ? 'text-terminal-green' : 'text-terminal-red'
                        }`}>
                          {position.pnl >= 0 ? '+' : ''}{formatPrice(position.pnl)}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span>Entry: </span>
                          <span className="font-mono">{formatPrice(position.avgEntry)}</span>
                        </div>
                        <div>
                          <span>Current: </span>
                          <span className="font-mono">{formatPrice(position.currentPrice)}</span>
                        </div>
                        <div className={position.pnlPercent >= 0 ? 'text-terminal-green' : 'text-terminal-red'}>
                          {formatChange(position.pnlPercent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Overview */}
        <TabsContent value="markets" className="mt-4">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4" />
                Top Movers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topMovers.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        asset.changePercent >= 0 ? 'bg-terminal-green' : 'bg-terminal-red'
                      }`} />
                      <div>
                        <div className="font-mono font-semibold">{asset.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          Vol: {(asset.volume / 1e9).toFixed(1)}B
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{formatPrice(asset.price)}</div>
                      <div className={`text-xs font-mono ${
                        asset.changePercent >= 0 ? 'text-terminal-green' : 'text-terminal-red'
                      }`}>
                        {formatChange(asset.changePercent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trade History */}
        <TabsContent value="history" className="mt-4">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Trade history coming soon</p>
                <p className="text-xs mt-1">Track your paper trading performance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};