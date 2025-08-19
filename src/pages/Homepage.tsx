import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { AgentPanel } from '@/components/AgentPanel';
import { TokenomicsPipeline } from '@/components/TokenomicsPipeline';
import { Newsletter } from '@/components/Newsletter';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Shield, 
  Smartphone,
  Zap,
  Users
} from 'lucide-react';

const Homepage = () => {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const agents = [
    {
      name: "Sentiment Agent",
      description: "Real-time crypto sentiment across social platforms, news, and options flow",
      icon: <Activity className="w-6 h-6" />,
      status: "active",
      highlights: ["X/Telegram analysis", "Influencer tracking", "Funding rates"]
    },
    {
      name: "Macro Agent", 
      description: "Global macro flows, Fed policy, and cross-asset correlations",
      icon: <TrendingUp className="w-6 h-6" />,
      status: "active",
      highlights: ["FOMC analysis", "DXY/yields impact", "Risk regime detection"]
    },
    {
      name: "Technical Agent",
      description: "Chart analysis, levels, and pattern recognition with high R:R setups",
      icon: <BarChart3 className="w-6 h-6" />,
      status: "active", 
      highlights: ["Market structure", "S/R levels", "Pattern detection"]
    },
    {
      name: "On-Chain Agent",
      description: "Blockchain flows, whale tracking, and smart money movements",
      icon: <Brain className="w-6 h-6" />,
      status: "active",
      highlights: ["Whale tracking", "DEX flows", "Token unlocks"]
    },
    {
      name: "Juno Advisor",
      description: "Synthesizes all agents into personalized, risk-aware research",
      icon: <Shield className="w-6 h-6" />,
      status: "active",
      highlights: ["Risk management", "Portfolio fit", "Clear invalidations"]
    }
  ];

  const features = [
    {
      title: "AI Portfolio Assistant",
      description: "Get personalized insights tailored to your holdings, risk profile, and investment horizon",
      icon: <Brain className="w-8 h-8 text-lime" />
    },
    {
      title: "Multi-Agent Intelligence", 
      description: "Five specialized AI agents working together to analyze sentiment, macro, technicals, and on-chain data",
      icon: <Users className="w-8 h-8 text-lime" />
    },
    {
      title: "Vision Chart Analysis",
      description: "Upload any chart and get instant AI analysis with levels, patterns, and trade ideas",
      icon: <BarChart3 className="w-8 h-8 text-lime" />
    },
    {
      title: "Mobile-First Simplicity",
      description: "Professional-grade research in a clean, fast interface designed for mobile trading",
      icon: <Smartphone className="w-8 h-8 text-lime" />
    }
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Header 
        connectedWallet={connectedWallet} 
        onWalletConnect={setConnectedWallet}
      />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-foreground">
                Your Crypto AI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Meet Juno, the AI-native crypto research platform. Trade smarter, invest confidently, 
                and master the market with personalized insights—live and research-grade.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app">
                <Button 
                  size="lg" 
                  className="btn-lime font-display text-lg px-8 py-4 w-full sm:w-auto"
                >
                  Open Web App
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="btn-outline-lime font-display text-lg px-8 py-4"
              >
                Get the App
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-lime rounded-full animate-pulse-lime"></div>
              Live market data • Real-time insights
            </div>
          </div>
          
          <div className="lg:pl-8">
            <AgentPanel />
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-display font-bold text-foreground">
            Your AI Agents, Built for Smarter Crypto Investing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Five specialized AI agents analyze every angle of the market, 
            then synthesize insights into clear, actionable research.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <Card key={agent.name} className="insight-card group hover:border-lime/30 transition-all">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-lime/10 rounded-xl">
                    {agent.icon}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`agent-${agent.status} border-lime/30 text-lime`}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <CardTitle className="font-display text-xl">
                  {agent.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {agent.description}
                </p>
                <ul className="space-y-1">
                  {agent.highlights.map((highlight) => (
                    <li key={highlight} className="text-sm text-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-lime rounded-full"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-display font-bold text-foreground">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional crypto research and trading decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="text-center space-y-4 group">
              <div className="mx-auto w-16 h-16 bg-surface rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-display font-bold text-foreground">
            Meet Juno
          </h2>
          <p className="text-xl text-muted-foreground">
            See how Juno's AI agents work together to analyze your portfolio
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="terminal-panel">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-3 h-3 bg-terminal-red rounded-full"></div>
                <div className="w-3 h-3 bg-terminal-amber rounded-full"></div>
                <div className="w-3 h-3 bg-terminal-green rounded-full"></div>
                <span className="text-muted-foreground text-sm font-mono">juno-research-terminal</span>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-3">
                  <span className="text-lime">user:</span>
                  <span className="text-foreground">Analyze my BTC position, cost basis $62,350</span>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-lime">juno:</span>
                  <div className="space-y-2 text-foreground">
                    <p>Analyzing your BTC position... 5 agents working</p>
                    <div className="text-muted-foreground">
                      <div className="agent-active">SentimentAgent: Bullish momentum (+1.2/2.0)</div>
                      <div className="agent-active">TechnicalAgent: Key support at $60k (-0.8/2.0)</div>
                      <div className="agent-active">MacroAgent: Fed uncertainty weighing (-0.5/2.0)</div>
                    </div>
                    <p className="text-lime">Market View: Neutral-bullish, 65% conviction</p>
                    <p>Your position: +3.2% from cost basis. Consider partial profit at $68k resistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-display font-bold text-foreground">
            Fuel the Research with $JNO
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stake $JNO to unlock deeper research capabilities and govern the platform's evolution
          </p>
        </div>
        
        <TokenomicsPipeline />
      </section>

      {/* Community CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-display font-bold text-foreground">
            Join Our AI-Powered Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with traders using AI-driven insights to navigate crypto markets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-lime font-display">
              Join Discord
            </Button>
            <Button size="lg" variant="outline" className="btn-outline-lime font-display">
              Follow Updates
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter & Footer */}
      <Newsletter />
      
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="font-display font-bold text-2xl text-lime mb-2">JUNO</div>
              <p className="text-sm text-muted-foreground">
                AI-native crypto research platform
              </p>
            </div>
            
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-lime transition-colors">Privacy</a>
              <a href="#" className="hover:text-lime transition-colors">Terms</a>
              <a href="#" className="hover:text-lime transition-colors">Disclosures</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            <p>$JNO is a utility token for access and governance. Not investment advice.</p>
            <p className="mt-2">This is research, not financial advice. Markets are risky.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;