import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="insight-card max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          {!isSubscribed ? (
            <>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-lime/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-lime" />
                </div>
                <h3 className="text-2xl font-display font-bold">
                  Stay Updated
                </h3>
                <p className="text-muted-foreground">
                  Get weekly market insights, agent updates, and early access to new features. 
                  No spam, unsubscribe anytime.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface border-border focus:border-lime"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-lime whitespace-nowrap"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  By subscribing, you agree to receive updates about Juno. We respect your privacy.
                </p>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-lime/10 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-lime" />
              </div>
              <h3 className="text-2xl font-display font-bold text-lime">
                You're All Set!
              </h3>
              <p className="text-muted-foreground">
                Thanks for subscribing. You'll receive our next market update in your inbox soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};