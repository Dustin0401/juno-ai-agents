import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AgentPanel = () => {
  const [currentAgent, setCurrentAgent] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const agentOutputs = [
    {
      agent: "SentimentAgent",
      status: "analyzing",
      output: [
        "Scanning 50k+ posts across X, Telegram...",
        "Bullish sentiment: +72% (24h trend)",
        "Key influencers: mostly neutral-positive",
        "Funding rate: -0.02% (slight bearish bias)"
      ]
    },
    {
      agent: "TechnicalAgent", 
      status: "analyzing",
      output: [
        "BTC/USD 4H chart analysis...",
        "Support: $62,350 (previous resistance)",
        "Resistance: $68,200 (EMA confluence)",
        "Pattern: Bull flag forming, 65% success rate"
      ]
    },
    {
      agent: "MacroAgent",
      status: "analyzing", 
      output: [
        "Fed policy uncertainty weighing on risk assets",
        "DXY showing strength (+0.8% today)",
        "10Y yield: 4.12% (crypto headwind)",
        "Correlation w/ QQQ: 0.73 (elevated)"
      ]
    },
    {
      agent: "OnChainAgent",
      status: "complete",
      output: [
        "Whale activity: 3 large BTC transfers to exchanges",
        "Exchange reserves: -2.1% (7d trend)",
        "Active addresses: +5.4% (bullish signal)",
        "Realized cap: $420B (support level)"
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentAgent((prev) => (prev + 1) % agentOutputs.length);
        setIsTyping(false);
      }, 800);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentOutput = agentOutputs[currentAgent];

  return (
    <Card className="terminal-panel min-h-[400px] relative overflow-hidden">
      <CardContent className="p-6">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="w-3 h-3 bg-terminal-red rounded-full"></div>
          <div className="w-3 h-3 bg-terminal-amber rounded-full"></div>
          <div className="w-3 h-3 bg-terminal-green rounded-full"></div>
          <span className="text-muted-foreground text-sm font-mono">juno-agent-monitor</span>
        </div>

        {/* Agent Status Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {agentOutputs.map((agent, index) => (
            <div 
              key={agent.agent}
              className={`flex items-center gap-2 text-xs font-mono transition-all ${
                index === currentAgent ? 'text-lime' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                agent.status === 'complete' ? 'bg-terminal-green' : 
                agent.status === 'analyzing' ? 'bg-terminal-amber animate-pulse' : 
                'bg-muted-foreground'
              }`}></div>
              {agent.agent}
            </div>
          ))}
        </div>

        {/* Current Agent Output */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="border-lime/30 text-lime font-mono text-xs">
              {currentOutput.agent}
            </Badge>
            <Badge variant="outline" className="border-terminal-amber/30 text-terminal-amber font-mono text-xs">
              {currentOutput.status}
            </Badge>
          </div>

          <div className="space-y-2 font-mono text-sm">
            {currentOutput.output.map((line, index) => (
              <div 
                key={index}
                className={`flex items-start gap-2 ${
                  isTyping && index === currentOutput.output.length - 1 ? 'opacity-50' : ''
                }`}
              >
                <span className="text-lime mt-0.5">›</span>
                <span className="text-foreground leading-relaxed">{line}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2">
                <span className="text-lime">›</span>
                <span className="text-lime animate-pulse">analyzing...</span>
                <div className="w-2 h-4 bg-lime animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Synthesis Status */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">Synthesis Pipeline</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-lime rounded-full animate-pulse"></div>
              <span className="text-lime">JunoAdvisor finalizing...</span>
            </div>
          </div>
        </div>

        {/* Floating cursor effect */}
        <div className="absolute bottom-6 right-6">
          <div className="w-3 h-5 bg-lime animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
};