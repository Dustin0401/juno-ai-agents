// Newsletter signup component with tier-based benefits
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  TrendingUp, 
  Zap, 
  Shield, 
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to JUNO Alpha. Check your email for confirmation."
      });
    }, 1500);
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Daily analysis from our AI research team",
      tier: "Free"
    },
    {
      icon: Zap,
      title: "Alpha Signals",
      description: "Early access to high-conviction trades",
      tier: "Premium"
    },
    {
      icon: Shield,
      title: "Risk Reports",
      description: "Portfolio risk analysis and recommendations",
      tier: "Premium"
    },
    {
      icon: Star,
      title: "Exclusive Content",
      description: "Private research notes and strategy guides",
      tier: "VIP"
    }
  ];

  const stats = [
    { label: "Subscribers", value: "12,500+" },
    { label: "Avg. Return", value: "+23.4%" },
    { label: "Success Rate", value: "78%" }
  ];

  if (isSubscribed) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-terminal-green mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Welcome to JUNO Alpha!</h3>
          <p className="text-muted-foreground mb-4">
            You'll receive your first research digest within 24 hours.
          </p>
          <Badge variant="outline" className="border-terminal-green/30 text-terminal-green">
            Subscription Active
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Mail className="w-6 h-6 text-lime" />
          JUNO Alpha Newsletter
        </CardTitle>
        <p className="text-muted-foreground">
          Get exclusive market insights and alpha signals delivered to your inbox
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-mono font-bold text-lime">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Benefits */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">What you'll get:</h4>
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border">
              <benefit.icon className="w-5 h-5 text-lime mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{benefit.title}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      benefit.tier === 'Free' ? 'border-terminal-green/30 text-terminal-green' :
                      benefit.tier === 'Premium' ? 'border-terminal-amber/30 text-terminal-amber' :
                      'border-lime/30 text-lime'
                    }`}
                  >
                    {benefit.tier}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Signup Form */}
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background border-border"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="btn-lime px-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-3 h-3" />
            <span>Free to start. Upgrade anytime for premium features.</span>
          </div>
        </form>

        {/* Social Proof */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            ⭐ Trusted by 500+ professional traders
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};