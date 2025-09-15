import React from 'react';
import { Activity, AlertTriangle, Download, RefreshCw, Zap, Clock, Database, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { format } from 'date-fns';

export const PerformanceDashboard: React.FC = () => {
  const { metrics, errors, isMonitoring, healthScore, clearErrors, exportReport } = usePerformanceMonitor();

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-terminal-green';
    if (score >= 60) return 'text-terminal-amber';
    return 'text-terminal-red';
  };

  const getHealthBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Good' };
    return { variant: 'destructive' as const, text: 'Needs Attention' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-lime" />
          <div>
            <h2 className="text-xl font-semibold">Performance Monitor</h2>
            <p className="text-sm text-muted-foreground">
              {isMonitoring ? 'Real-time monitoring active' : 'Monitoring unavailable'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={clearErrors} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Errors
          </Button>
          <Button onClick={exportReport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-lime" />
              Overall Health Score
            </span>
            <Badge {...getHealthBadge(healthScore)}>
              {getHealthBadge(healthScore).text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}/100
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {format(metrics.lastUpdate, 'HH:mm:ss')}
              </div>
            </div>
            <Progress value={healthScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Clock}
          title="Load Time"
          value={`${metrics.loadTime.toFixed(0)}ms`}
          status={metrics.loadTime < 1000 ? 'good' : metrics.loadTime < 3000 ? 'warning' : 'error'}
        />
        
        <MetricCard
          icon={Database}
          title="Memory Usage"
          value={`${metrics.memoryUsage.toFixed(1)}MB`}
          status={metrics.memoryUsage < 50 ? 'good' : metrics.memoryUsage < 100 ? 'warning' : 'error'}
        />
        
        <MetricCard
          icon={Wifi}
          title="Network Requests"
          value={metrics.networkRequests.toString()}
          status="neutral"
        />
        
        <MetricCard
          icon={AlertTriangle}
          title="Errors"
          value={metrics.errorCount.toString()}
          status={metrics.errorCount === 0 ? 'good' : metrics.errorCount < 5 ? 'warning' : 'error'}
        />
      </div>

      {/* Error Log */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Recent Errors ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {errors.map(error => (
                  <div key={error.id} className="p-3 bg-surface rounded-xl border-l-4 border-destructive">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-mono text-sm text-destructive font-medium">
                        {error.message}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {format(error.timestamp, 'HH:mm:ss')}
                      </div>
                    </div>
                    
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          Stack trace
                        </summary>
                        <pre className="mt-2 text-xs bg-background p-2 rounded overflow-x-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      {error.url}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* No Errors State */}
      {errors.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-lime" />
            <div className="text-lg font-medium text-foreground mb-2">No Errors Detected</div>
            <div className="text-sm">Your application is running smoothly!</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  status: 'good' | 'warning' | 'error' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, title, value, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-terminal-green';
      case 'warning': return 'text-terminal-amber';
      case 'error': return 'text-terminal-red';
      default: return 'text-muted-foreground';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'good': return 'border-terminal-green/20';
      case 'warning': return 'border-terminal-amber/20';
      case 'error': return 'border-terminal-red/20';
      default: return 'border-border';
    }
  };

  return (
    <Card className={`${getBorderColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Icon className={`w-5 h-5 ${getStatusColor()}`} />
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {value}
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {title}
        </div>
      </CardContent>
    </Card>
  );
};