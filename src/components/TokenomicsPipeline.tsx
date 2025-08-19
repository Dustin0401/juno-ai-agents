import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const TokenomicsPipeline = () => {
  const [activeFlow, setActiveFlow] = useState(0);

  const tokenomicsData = [
    {
      title: "Stake → Credits",
      description: "Stake $JNO to receive daily Research Credits for agent calls",
      metric: "100 RC/day",
      tier: "Analyst (1,000+ $JNO)"
    },
    {
      title: "Priority Access", 
      description: "Higher tiers get faster agent responses and early feature access",
      metric: "2x faster",
      tier: "Pro tier benefits"
    },
    {
      title: "Vision & Backtests",
      description: "Advanced chart analysis and historical strategy testing",
      metric: "3Y backtests",
      tier: "Pro exclusive"
    },
    {
      title: "Governance",
      description: "Vote on agent weights, platform parameters, and treasury decisions", 
      metric: "1 token = 1 vote",
      tier: "All holders"
    },
    {
      title: "Operator Rewards",
      description: "Data providers and model operators earn $JNO for accuracy and uptime",
      metric: "50% fee share",
      tier: "Operator network"
    }
  ];

  const tiers = [
    { name: "Free", stake: "0", credits: "10 RC/day", features: "Basic alerts, Single chart" },
    { name: "Analyst", stake: "1,000+", credits: "100 RC/day", features: "Multi-chart, Early access" },
    { name: "Pro", stake: "10,000+", credits: "500 RC/day", features: "API access, Backtests" },
    { name: "Fund", stake: "100,000+", credits: "Unlimited", features: "Dedicated workers, SLA" }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Left: Benefits */}
      <div className="space-y-6">
        <div className="space-y-4">
          {tokenomicsData.map((item, index) => (
            <Card 
              key={item.title}
              className={`insight-card cursor-pointer transition-all ${
                activeFlow === index ? 'border-lime/50 bg-lime/5' : 'hover:border-lime/30'
              }`}
              onClick={() => setActiveFlow(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-mono text-lime font-medium">{item.metric}</div>
                    <Badge variant="outline" className="border-lime/30 text-lime text-xs">
                      {item.tier}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground bg-surface rounded-xl p-4">
          <p className="mb-2 font-semibold">$JNO Utility Token</p>
          <p>Governance and access only • No revenue share • Jurisdiction checks apply</p>
        </div>
      </div>

      {/* Right: Pipeline Animation */}
      <div className="space-y-8">
        {/* Animated Pipeline SVG */}
        <Card className="terminal-panel">
          <CardContent className="p-8">
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-xl text-center mb-8">
                Token Flow Pipeline
              </h3>
              
              <svg viewBox="0 0 400 300" className="w-full h-64">
                {/* Pipeline Path */}
                <defs>
                  <path 
                    id="pipeline" 
                    d="M 50,50 Q 200,50 350,100 Q 350,150 200,200 Q 50,200 50,250" 
                    fill="none" 
                    stroke="hsl(var(--lime))" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </defs>
                
                {/* Pipeline nodes */}
                <circle cx="50" cy="50" r="8" fill="hsl(var(--lime))" />
                <circle cx="350" cy="100" r="8" fill="hsl(var(--lime))" />
                <circle cx="200" cy="200" r="8" fill="hsl(var(--lime))" />
                <circle cx="50" cy="250" r="8" fill="hsl(var(--lime))" />
                
                {/* Flow dots */}
                {[0, 0.25, 0.5, 0.75].map((offset, index) => (
                  <circle 
                    key={index}
                    r="3" 
                    fill="hsl(var(--lime))"
                    className="pipeline-dot"
                    style={{ 
                      animationDelay: `${index * 3}s`,
                      offsetPath: 'path("M 50,50 Q 200,50 350,100 Q 350,150 200,200 Q 50,200 50,250")',
                      offsetDistance: `${offset * 100}%`
                    }}
                  />
                ))}
                
                {/* Labels */}
                <text x="50" y="35" textAnchor="middle" className="fill-foreground font-mono text-xs">Stake</text>
                <text x="350" y="85" textAnchor="middle" className="fill-foreground font-mono text-xs">Credits</text>
                <text x="200" y="185" textAnchor="middle" className="fill-foreground font-mono text-xs">Research</text>
                <text x="50" y="270" textAnchor="middle" className="fill-foreground font-mono text-xs">Govern</text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Tier Breakdown */}
        <div className="space-y-4">
          <h4 className="font-display font-semibold text-lg">Staking Tiers</h4>
          <div className="grid gap-3">
            {tiers.map((tier) => (
              <Card key={tier.name} className="insight-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={tier.name === 'Free' ? 'outline' : 'default'}
                          className={tier.name === 'Free' ? 'border-muted' : 'bg-lime text-lime-foreground'}
                        >
                          {tier.name}
                        </Badge>
                        <span className="font-mono text-sm font-medium">{tier.credits}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tier.features}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-lime">{tier.stake} $JNO</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};