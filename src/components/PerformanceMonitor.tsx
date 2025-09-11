// Real-time performance monitoring with AI optimization
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Cpu
} from 'lucide-react';

interface PerformanceMetric {
  timestamp: Date;
  latency: number;
  accuracy: number;
  confidence: number;
  throughput: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time performance data
  useEffect(() => {
    if (!isMonitoring) return;

    const generateMetric = (): PerformanceMetric => ({
      timestamp: new Date(),
      latency: Math.random() * 100 + 50, // 50-150ms
      accuracy: Math.random() * 15 + 85, // 85-100%
      confidence: Math.random() * 20 + 80, // 80-100%
      throughput: Math.random() * 50 + 100 // 100-150 ops/sec
    });

    const interval = setInterval(() => {
      const newMetric = generateMetric();
      setMetrics(prev => [...prev.slice(-19), newMetric]);
    }, 2000);

    // Initialize with some data
    const initialData = Array.from({ length: 20 }, () => generateMetric());
    setMetrics(initialData);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const latestMetric = metrics[metrics.length - 1];

  const agentStatus = [
    {
      name: 'Sentiment Agent',
      status: 'active',
      cpu: 23,
      memory: 456,
      accuracy: 94.2,
      uptime: '99.8%'
    },
    {
      name: 'Technical Agent',
      status: 'active',
      cpu: 31,
      memory: 512,
      accuracy: 91.7,
      uptime: '99.9%'
    },
    {
      name: 'Macro Agent',
      status: 'active',
      cpu: 18,
      memory: 384,
      accuracy: 88.4,
      uptime: '99.7%'
    },
    {
      name: 'On-Chain Agent',
      status: 'active',
      cpu: 42,
      memory: 678,
      accuracy: 96.1,
      uptime: '99.6%'
    },
    {
      name: 'Juno Advisor',
      status: 'active',
      cpu: 56,
      memory: 834,
      accuracy: 92.8,
      uptime: '99.9%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-terminal-green/20 text-terminal-green border-terminal-green/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCpuColor = (cpu: number) => {
    if (cpu > 80) return 'text-red-400';
    if (cpu > 60) return 'text-amber-400';
    return 'text-terminal-green';
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-surface border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Avg Latency</div>
                <div className="text-2xl font-mono font-semibold">
                  {latestMetric ? `${latestMetric.latency.toFixed(0)}ms` : '-'}
                </div>
              </div>
              <Clock className="w-8 h-8 text-lime opacity-60" />
            </div>
            <Progress value={latestMetric ? 100 - (latestMetric.latency / 2) : 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">AI Accuracy</div>
                <div className="text-2xl font-mono font-semibold text-terminal-green">
                  {latestMetric ? `${latestMetric.accuracy.toFixed(1)}%` : '-'}
                </div>
              </div>
              <Target className="w-8 h-8 text-lime opacity-60" />
            </div>
            <Progress value={latestMetric?.accuracy || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Confidence</div>
                <div className="text-2xl font-mono font-semibold text-lime">
                  {latestMetric ? `${latestMetric.confidence.toFixed(0)}%` : '-'}
                </div>
              </div>
              <Brain className="w-8 h-8 text-lime opacity-60" />
            </div>
            <Progress value={latestMetric?.confidence || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Throughput</div>
                <div className="text-2xl font-mono font-semibold">
                  {latestMetric ? `${latestMetric.throughput.toFixed(0)}` : '-'}
                </div>
                <div className="text-xs text-muted-foreground">ops/sec</div>
              </div>
              <Zap className="w-8 h-8 text-lime opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-lime" />
              Real-Time Performance
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`${isMonitoring ? 'bg-lime/10 border-lime/30' : 'hover:bg-lime/10'}`}
            >
              {isMonitoring ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
                  stroke="#6b7280" 
                  fontSize={12} 
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#84cc16" 
                  strokeWidth={2}
                  dot={false}
                  name="Latency (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Agent Status */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-lime" />
            Agent Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentStatus.map((agent) => (
              <div key={agent.name} className="p-4 bg-background rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Uptime: {agent.uptime}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">CPU Usage</div>
                    <div className={`font-mono text-sm ${getCpuColor(agent.cpu)}`}>
                      {agent.cpu}%
                    </div>
                    <Progress value={agent.cpu} className="mt-1 h-1" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Memory</div>
                    <div className="font-mono text-sm">{agent.memory}MB</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                    <div className="font-mono text-sm text-terminal-green">
                      {agent.accuracy}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                      <span className="text-xs">Running</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};