import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { ChartVision } from '@/components/ChartVision';
import { PaperTradingModal } from '@/components/PaperTradingModal';
import { PortfolioPanel } from '@/components/PortfolioPanel';
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
  const [showChartVision, setShowChartVision] = useState(false);
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
    <div className="min-h-screen bg-background font-body flex">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border flex flex-col">
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
              <Button variant="ghost" size="sm" className="w-full justify-start">
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

        {/* User Status & Portfolio Panel */}
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
          
          {/* Mini Portfolio Panel */}
          <Card className="bg-background">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Portfolio P&L</div>
                <div className="font-mono text-terminal-green text-sm">+$127.50</div>
                <div className="text-xs text-terminal-green">+0.25%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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
            
            <Button variant="outline" className="btn-outline-lime">
              Connect Wallet
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-lime text-lime-foreground' 
                    : 'bg-surface border border-border'
                }`}>
                  <p>{message.content}</p>
                </div>
                
                {/* Agent Responses */}
                {message.junoResponse?.agent_evidence && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-display font-semibold text-sm text-muted-foreground">Agent Analysis</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {message.junoResponse.agent_evidence.map((agent) => (
                        <Card key={agent.agent} className="insight-card">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-display">{agent.agent}</CardTitle>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  agent.score > 0 ? 'border-terminal-green/30 text-terminal-green' :
                                  agent.score < 0 ? 'border-terminal-red/30 text-terminal-red' :
                                  'border-terminal-amber/30 text-terminal-amber'
                                }`}
                              >
                                {agent.score > 0 ? '+' : ''}{agent.score.toFixed(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              Confidence: {agent.confidence}%
                            </div>
                            <ul className="space-y-1">
                              {agent.highlights.map((highlight, idx) => (
                                <li key={idx} className="text-xs flex items-start gap-2">
                                  <div className="w-1 h-1 bg-lime rounded-full mt-1.5 flex-shrink-0"></div>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Market Analysis */}
                {message.junoResponse?.market_view && (
                  <div className="mt-4">
                    <Card className="insight-card">
                      <CardHeader>
                        <CardTitle className="font-display flex items-center justify-between">
                          Market View: {message.junoResponse.market_view.asset}
                          <Badge 
                            variant="outline"
                            className={`${
                              message.junoResponse.market_view.bias === 'bullish' ? 'border-terminal-green/30 text-terminal-green' :
                              message.junoResponse.market_view.bias === 'bearish' ? 'border-terminal-red/30 text-terminal-red' :
                              'border-terminal-amber/30 text-terminal-amber'
                            }`}
                          >
                            {message.junoResponse.market_view.bias} • {message.junoResponse.market_view.conviction}% conviction
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-sm mb-2">Key Levels</h5>
                            <div className="space-y-1 text-sm">
                              <div>Support: {message.junoResponse.market_view.key_levels.support.map(s => `$${s.toLocaleString()}`).join(', ')}</div>
                              <div>Resistance: {message.junoResponse.market_view.key_levels.resistance.map(r => `$${r.toLocaleString()}`).join(', ')}</div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm mb-2">Risk/Reward</h5>
                            <div className="text-lg font-mono text-lime">2.5:1</div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-sm mb-2">Recommendations</h5>
                          <ul className="space-y-1">
                            {message.junoResponse.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-lime rounded-full mt-2 flex-shrink-0"></div>
                                {rec.entry_zone} - {rec.fit_for_user}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="btn-outline-lime w-full"
                          onClick={() => {
                            setCurrentAnalysis(message.junoResponse.market_view);
                            setShowPaperTrading(true);
                          }}
                        >
                          Simulate Trade
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
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
      <ChartVision />
      <PaperTradingModal 
        isOpen={showPaperTrading}
        onClose={() => setShowPaperTrading(false)}
        analysis={currentAnalysis}
      />
    </div>
  );
};

export default Research;