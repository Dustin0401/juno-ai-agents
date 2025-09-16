import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Paperclip, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Brain,
  Shield,
  Upload,
  Home,
  Settings,
  Bell,
  History,
  Wallet,
  Zap
} from 'lucide-react';
import { JunoOrchestrator, type UserProfile, type QueryContext, type JunoResponse } from '@/lib/agents';
import { useWallet } from '@/hooks/useWallet';
import { CommandPalette } from '@/components/CommandPalette';

import { PaperTradingModal } from '@/components/PaperTradingModal';
import { PortfolioPanel } from '@/components/PortfolioPanel';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { TradingStrategies } from '@/components/TradingStrategies';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { TokenomicsPipeline } from '@/components/TokenomicsPipeline';
import { Newsletter } from '@/components/Newsletter';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  junoResponse?: JunoResponse;
}

interface AgentResponse {
  agent: string;
  score: number;
  confidence: number;
  highlights: string[];
  status: 'complete' | 'analyzing' | 'pending';
}

interface MarketAnalysis {
  asset: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  conviction: number;
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  recommendations: string[];
  riskReward: number;
}

const Research = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Juno Research. I\'m your AI advisor powered by 5 specialized agents. How can I help you analyze the market today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  
  const [showPaperTrading, setShowPaperTrading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { walletInfo, connectWallet, disconnectWallet, isConnecting, formatAddress } = useWallet();
  const { toast } = useToast();

  const assets = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'UNI'];
  const timeframes = ['1h', '4h', '1d', '1w'];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAnalyzing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user', 
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');
    setIsAnalyzing(true);

    try {
      // Mock user profile for demo
      const mockProfile: UserProfile = {
        objective: 'growth',
        horizon: 'swing',
        risk_tolerance: 'med',
        jurisdictions: ['US'],
        assets_followed: ['BTC', 'ETH'],
        exchanges: ['Coinbase', 'Binance'],
        portfolio_positions: [{ symbol: 'BTC', size: 0.5, cost: 62000 }],
        cash_allocation: 0.5,
        notifications_opt_in: true,
        staking_tier: walletInfo?.tier || 'Free',
        reputation_score: 75
      };

      const mockContext: QueryContext = {
        market_clock: new Date().toISOString(),
        risk_regime: 'calm',
        news_heat: 3,
        chain_activity_heat: 2
      };

      const response = await JunoOrchestrator.processQuery(query, mockProfile, mockContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.summary,
        timestamp: new Date(),
        junoResponse: response
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentAnalysis(response.market_view);
    } catch (error) {
      toast({
        title: "Analysis failed", 
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    setIsAnalyzing(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const shortcuts = [
    { command: '/chart', description: 'Upload chart for analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { command: '/macro', description: 'Macro market overview', icon: <TrendingUp className="w-4 h-4" /> },
    { command: '/onchain', description: 'On-chain activity report', icon: <Brain className="w-4 h-4" /> },
    { command: '/sentiment', description: 'Social sentiment analysis', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Main Navigation Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-surface h-14">
              <TabsTrigger value="chat" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
                <Brain className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="strategies" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
                <Activity className="w-4 h-4 mr-2" />
                Strategies
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
                <Zap className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="tokenomics" className="data-[state=active]:bg-lime data-[state=active]:text-lime-foreground">
                <Shield className="w-4 h-4 mr-2" />
                Tokenomics
              </TabsTrigger>
            </TabsList>

            {/* Chat Interface */}
            <TabsContent value="chat" className="mt-0">
              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-surface border-r border-border flex flex-col h-screen">
                  {/* Logo */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
                        <span className="font-display font-bold text-lime-foreground">J</span>
                      </div>
                      <span className="font-display font-bold text-xl">JUNO</span>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 p-4 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Research</h3>
                      <div className="space-y-1">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Home className="w-4 h-4 mr-2" />
                          New Chat
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <History className="w-4 h-4 mr-2" />
                          History
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Watchlists</h3>
                      <div className="space-y-1">
                        {assets.map(asset => (
                          <Button key={asset} variant="ghost" size="sm" className="w-full justify-start">
                            <div className="w-2 h-2 bg-lime rounded-full mr-3"></div>
                            {asset}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</h3>
                      <div className="space-y-1">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Bell className="w-4 h-4 mr-2" />
                          Alerts
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => window.location.href = '/backtest'}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Backtests
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* User Status */}
                  <div className="p-4 border-t border-border space-y-4">
                    <Card className="bg-background">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-lime/30 text-lime">{walletInfo?.tier || 'Free Tier'}</Badge>
                            <span className="text-xs text-muted-foreground">{walletInfo?.researchCredits || 7}/10 RC</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {walletInfo ? formatAddress(walletInfo.address) : 'Connect wallet to stake'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Chat Area - keep existing chat implementation */}
                <div className="flex-1 flex flex-col h-screen">
                  {/* ... existing chat implementation from lines 244-490 ... */}
                  <div className="border-b border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {assets.map(asset => (
                            <Button key={asset} variant="outline" size="sm" className="text-xs">
                              {asset}
                            </Button>
                          ))}
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex gap-2">
                          {timeframes.map(tf => (
                            <Button key={tf} variant="outline" size="sm" className="text-xs">
                              {tf}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-6">
                    {/* ... existing messages implementation ... */}
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {/* ... keep existing message rendering ... */}
                      </div>
                    ))}
                    
                    {isAnalyzing && (
                      <div className="flex justify-start">
                        <div className="bg-surface border border-border rounded-2xl p-4 max-w-md">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-lime rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-lime rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 bg-lime rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">Agents analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-border p-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                      {/* Shortcuts */}
                      <div className="flex flex-wrap gap-2">
                        {shortcuts.map((shortcut) => (
                          <Button
                            key={shortcut.command}
                            variant="outline"
                            size="sm"
                            onClick={() => setInputValue(shortcut.command + ' ')}
                            className="text-xs"
                          >
                            {shortcut.icon}
                            <span className="ml-1">{shortcut.command}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about markets, upload a chart, or use /commands..."
                            className="bg-surface border-border focus:border-lime pr-20"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={handleFileUpload}
                              className="h-6 w-6 p-0"
                            >
                              <Paperclip className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isAnalyzing}
                          className="btn-lime"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        Research only. Markets are risky. • 7 research credits remaining today
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* New Advanced Tabs */}
            <TabsContent value="portfolio" className="mt-6">
              <div className="container mx-auto px-4 pb-8">
                <PortfolioPanel />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="container mx-auto px-4 pb-8">
                <AdvancedAnalytics />
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="mt-6">
              <div className="container mx-auto px-4 pb-8">
                <TradingStrategies />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="container mx-auto px-4 pb-8">
                <PerformanceMonitor />
              </div>
            </TabsContent>

            <TabsContent value="tokenomics" className="mt-6">
              <div className="container mx-auto px-4 pb-8">
                <TokenomicsPipeline />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setInputValue(`/chart ${file.name} uploaded`);
          }
        }}
      />

      {/* Modals */}
      <CommandPalette onSlashCommand={(cmd) => setInputValue(cmd + ' ')} />
      
      <PaperTradingModal 
        isOpen={showPaperTrading}
        onClose={() => setShowPaperTrading(false)}
        analysis={currentAnalysis}
      />
    </div>
  );
};

export default Research;