// Real-time notification system for market alerts and AI insights
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain,
  X,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'insight' | 'trade' | 'news';
  agent: string;
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  symbol?: string;
  price?: number;
  change?: number;
  read: boolean;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotification = (): Notification => {
      const types: Notification['type'][] = ['alert', 'insight', 'trade', 'news'];
      const agents = ['Sentiment Agent', 'Technical Agent', 'Macro Agent', 'On-Chain Agent', 'Juno Advisor'];
      const symbols = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK'];
      
      const type = types[Math.floor(Math.random() * types.length)];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      
      const notifications: Record<string, { title: string; message: string; priority: Notification['priority'] }> = {
        alert: {
          title: `${symbol} Price Alert`,
          message: `${symbol} has moved beyond your set threshold. Current price: $${(Math.random() * 50000 + 20000).toFixed(2)}`,
          priority: 'high'
        },
        insight: {
          title: `Market Insight: ${symbol}`,
          message: `Technical analysis suggests potential breakout pattern forming on ${symbol}`,
          priority: 'medium'
        },
        trade: {
          title: 'Trade Opportunity',
          message: `High conviction setup identified on ${symbol} with 3:1 R/R ratio`,
          priority: 'high'
        },
        news: {
          title: 'Market Update',
          message: `Significant on-chain activity detected for ${symbol}. Whale movements increasing`,
          priority: 'low'
        }
      };

      const notificationData = notifications[type];
      
      return {
        id: `notif-${Date.now()}-${Math.random()}`,
        type,
        agent,
        title: notificationData.title,
        message: notificationData.message,
        timestamp: new Date(),
        priority: notificationData.priority,
        symbol,
        price: Math.random() * 50000 + 20000,
        change: (Math.random() - 0.5) * 20,
        read: false
      };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = generateNotification();
        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
      }
    }, 5000);

    // Add initial notifications
    const initialNotifications = Array.from({ length: 5 }, () => generateNotification());
    setNotifications(initialNotifications);

    return () => clearInterval(interval);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'high') return notification.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'insight': return <Brain className="w-4 h-4 text-lime" />;
      case 'trade': return <TrendingUp className="w-4 h-4 text-terminal-green" />;
      case 'news': return <Bell className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-lime/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 bg-surface border-border shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="h-7 px-2 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  className="h-7 px-2 text-xs"
                >
                  Unread
                </Button>
                <Button
                  variant={filter === 'high' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('high')}
                  className="h-7 px-2 text-xs"
                >
                  High Priority
                </Button>
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 px-2 text-xs text-lime hover:text-lime-dark"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-2 p-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all hover:bg-background/50 ${
                        notification.read 
                          ? 'bg-background border-border opacity-75' 
                          : 'bg-surface border-lime/20'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{notification.title}</div>
                            <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{notification.agent}</span>
                            <span className="text-muted-foreground">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {notification.symbol && notification.change && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-mono">{notification.symbol}</span>
                              <span className={`font-mono ${
                                notification.change >= 0 ? 'text-terminal-green' : 'text-terminal-red'
                              }`}>
                                {notification.change >= 0 ? '+' : ''}{notification.change.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};