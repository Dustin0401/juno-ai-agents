// Advanced portfolio analytics with AI-powered insights
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const AdvancedAnalytics = () => {
  const [timeframe, setTimeframe] = useState('24h');

  // Mock portfolio performance data
  const performanceData = [
    { time: '00:00', value: 50000, benchmark: 48000 },
    { time: '04:00', value: 51200, benchmark: 48500 },
    { time: '08:00', value: 49800, benchmark: 47800 },
    { time: '12:00', value: 52100, benchmark: 49200 },
    { time: '16:00', value: 53400, benchmark: 50100 },
    { time: '20:00', value: 52800, benchmark: 49800 },
    { time: '24:00', value: 54200, benchmark: 50500 }
  ];

  // Risk metrics
  const riskMetrics = [
    { name: 'Portfolio Beta', value: 1.24, status: 'medium', description: 'Higher volatility than market' },
    { name: 'Sharpe Ratio', value: 0.87, status: 'good', description: 'Good risk-adjusted returns' },
    { name: 'Max Drawdown', value: -12.4, status: 'warning', description: 'Moderate downside risk' },
    { name: 'VaR (95%)', value: -8.7, status: 'medium', description: 'Daily value at risk' }
  ];

  // Allocation data
  const allocationData = [
    { name: 'BTC', value: 45, amount: 24300, color: '#f7931a' },
    { name: 'ETH', value: 25, amount: 13500, color: '#627eea' },
    { name: 'SOL', value: 15, amount: 8100, color: '#9945ff' },
    { name: 'AVAX', value: 10, amount: 5400, color: '#e84142' },
    { name: 'Other', value: 5, amount: 2700, color: '#84cc16' }
  ];

  // AI insights
  const aiInsights = [
    {
      agent: 'Risk Agent',
      insight: 'Consider rebalancing - BTC allocation is 15% above optimal range',
      confidence: 87,
      action: 'Reduce BTC by 10%',
      impact: '+$2,400 expected value',
      priority: 'high'
    },
    {
      agent: 'Macro Agent',
      insight: 'Fed pivot probability increasing - favor risk-on assets',
      confidence: 73,
      action: 'Increase altcoin exposure',
      impact: '+15% upside potential',
      priority: 'medium'
    },
    {
      agent: 'Technical Agent',
      insight: 'SOL showing bullish divergence on 4H chart',
      confidence: 91,
      action: 'Add to SOL position',
      impact: '3:1 R/R ratio setup',
      priority: 'high'
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    { label: '24h Return', value: '+3.2%', change: '+0.4%', positive: true },
    { label: '7d Return', value: '+12.7%', change: '+2.1%', positive: true },
    { label: '30d Return', value: '-2.1%', change: '-1.8%', positive: false },
    { label: 'Total Return', value: '+24.8%', change: '+0.9%', positive: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-terminal-green';
      case 'warning': return 'text-amber-400';
      case 'medium': return 'text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <Target className="w-4 h-4 text-amber-400" />;
      default: return <CheckCircle className="w-4 h-4 text-lime" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-lime" />
            Portfolio Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className={`text-2xl font-mono font-semibold ${
                  metric.positive ? 'text-terminal-green' : 'text-terminal-red'
                }`}>
                  {metric.value}
                </div>
                <div className={`text-xs font-mono ${
                  metric.positive ? 'text-terminal-green' : 'text-terminal-red'
                }`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#84cc16" 
                  strokeWidth={2}
                  fill="url(#portfolioGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#6b7280" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  fill="url(#benchmarkGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Analysis */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-lime" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className={`font-mono text-sm ${getStatusColor(metric.status)}`}>
                    {metric.value > 0 ? '+' : ''}{metric.value}
                    {metric.name.includes('Ratio') ? '' : '%'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-lime" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {allocationData.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-sm font-mono">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">${asset.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{asset.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-lime" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-background rounded-xl border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(insight.priority)}
                    <span className="font-medium text-sm">{insight.agent}</span>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-foreground mb-2">{insight.insight}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Recommended Action:</span>
                    <p className="font-medium text-lime">{insight.action}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Impact:</span>
                    <p className="font-medium text-terminal-green">{insight.impact}</p>
                  </div>
                </div>
                
                <Progress 
                  value={insight.confidence} 
                  className="mt-2 h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};