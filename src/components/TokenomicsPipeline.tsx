// Enhanced TokenomicsPipeline with animations and interactivity
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, Users, Zap, Shield, Play, Pause } from 'lucide-react';

export const TokenomicsPipeline = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const stages = [
    {
      id: 1,
      title: "Research Credits (RC)",
      description: "Earn through quality contributions",
      icon: Coins,
      color: "text-lime",
      bg: "bg-lime/10",
      metrics: ["1,000 RC earned", "Top 5% contributor"],
      status: "active"
    },
    {
      id: 2,
      title: "Tier Advancement", 
      description: "Unlock premium features",
      icon: Shield,
      color: "text-terminal-amber",
      bg: "bg-terminal-amber/10",
      metrics: ["Silver → Gold", "New tools unlocked"],
      status: "pending"
    },
    {
      id: 3,
      title: "Alpha Access",
      description: "Exclusive research & signals",
      icon: Zap,
      color: "text-terminal-green",
      bg: "bg-terminal-green/10", 
      metrics: ["5 alpha signals", "Early access enabled"],
      status: "pending"
    },
    {
      id: 4,
      title: "Community Impact",
      description: "Share insights, earn rewards",
      icon: Users,
      color: "text-lime",
      bg: "bg-lime/10",
      metrics: ["50+ upvotes", "Verified contributor"],
      status: "pending"
    }
  ];

  // Auto-advance animation
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating, stages.length]);

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-lime" />
            Tokenomics Pipeline
          </div>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="hover:bg-lime/10"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stages.map((stage, index) => (
            <div key={stage.title} className="relative">
              {/* Stage Card */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 ${
                stage.bg
              } ${
                currentStep === index && isAnimating 
                  ? 'border-lime/50 shadow-lg shadow-lime/20 scale-105' 
                  : 'border-border hover:border-lime/30'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl bg-background transition-all ${
                    currentStep === index && isAnimating ? 'animate-pulse-lime' : ''
                  }`}>
                    <stage.icon className={`w-5 h-5 ${stage.color} transition-all ${
                      currentStep === index && isAnimating ? 'scale-110' : ''
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{stage.title}</h3>
                    <div className={`w-2 h-2 rounded-full mt-1 ${
                      stage.status === 'active' ? 'bg-terminal-green animate-pulse' :
                      currentStep === index && isAnimating ? 'bg-lime animate-pulse' : 'bg-muted-foreground'
                    }`} />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {stage.description}
                </p>
                
                <div className="space-y-1">
                  {stage.metrics.map((metric, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className={`text-xs mr-1 transition-all ${
                        currentStep === index && isAnimating 
                          ? 'border-lime/50 text-lime animate-fade-in' 
                          : ''
                      }`}
                    >
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Arrow connector */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className={`w-6 h-6 transition-all ${
                    currentStep === index && isAnimating 
                      ? 'text-lime animate-pulse scale-110' 
                      : 'text-muted-foreground'
                  }`} />
                </div>
              )}
              
              {/* Pipeline animation dots */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-1 bg-border rounded-full overflow-hidden">
                  <div className={`pipeline-dot ${
                    currentStep === index && isAnimating ? 'opacity-100' : 'opacity-30'
                  }`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center space-y-2">
          <Badge variant="outline" className="text-xs">
            🚀 Join 10,000+ researchers earning rewards
          </Badge>
          
          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {stages.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-lime' : 'bg-muted-foreground hover:bg-lime/50'
                }`}
                onClick={() => setCurrentStep(idx)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};