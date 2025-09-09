// Multi-Agent Orchestration System
// Based on Juno Research Orchestrator from master prompt

export interface UserProfile {
  objective: 'income' | 'growth' | 'hedge';
  horizon: 'intraday' | 'swing' | 'position' | 'long_term';
  risk_tolerance: 'low' | 'med' | 'high';
  jurisdictions: string[];
  assets_followed: string[];
  exchanges: string[];
  portfolio_positions: Array<{ symbol: string; size: number; cost: number }>;
  cash_allocation: number;
  notifications_opt_in: boolean;
  staking_tier: 'Free' | 'Analyst' | 'Pro' | 'Fund';
  reputation_score: number;
}

export interface QueryContext {
  market_clock: string;
  risk_regime: 'calm' | 'volatile' | 'crisis';
  news_heat: number;
  chain_activity_heat: number;
}

export interface AgentEvidence {
  agent: 'Sentiment' | 'Macro' | 'Technical' | 'OnChain';
  score: number; // -2 to +2
  confidence: number; // 0-100
  highlights: string[];
  sources?: string[];
  levels?: { s: number[]; r: number[] };
  patterns?: string[];
  flows?: string[];
  contracts?: string[];
}

export interface MarketView {
  asset: string;
  timeframe: '1h' | '4h' | '1d' | '1w';
  bias: 'bullish' | 'bearish' | 'neutral';
  conviction: number; // 0-100
  key_levels: { support: number[]; resistance: number[] };
  catalysts: string[];
  risks: string[];
}

export interface Recommendation {
  type: 'idea' | 'hedge' | 'rebalance' | 'alert';
  entry_zone: string;
  invalidation: string;
  targets: string[];
  r_r: number;
  probability_win: number;
  time_horizon: 'intraday' | 'swing' | 'position';
  sizing_guidance: string;
  fit_for_user: string;
}

export interface BacktestSnapshot {
  strategy_id: string;
  sample_period: string;
  n_trades: number;
  win_rate: number;
  expectancy: number;
  max_dd: number;
  notes: string;
}

export interface JunoResponse {
  summary: string;
  market_view: MarketView;
  recommendations: Recommendation[];
  agent_evidence: AgentEvidence[];
  backtest_snapshot?: BacktestSnapshot;
  disclosures: string[];
}

// Simulate agent responses based on query type and market conditions
export class JunoOrchestrator {
  private static readonly FUSION_WEIGHTS = {
    sentiment: 0.20,
    macro: 0.25,
    technical: 0.30,
    onchain: 0.25
  };

  static async processQuery(
    query: string,
    userProfile: UserProfile,
    context: QueryContext,
    attachments?: File[]
  ): Promise<JunoResponse> {
    // Detect query type and route to appropriate agents
    const queryType = this.detectQueryType(query);
    const agents = this.selectAgents(queryType);
    
    // Simulate agent analysis (in production, this would call actual AI agents)
    const agentEvidence = await Promise.all(
      agents.map(agent => this.simulateAgent(agent, query, context))
    );

    // Fusion logic - combine agent signals
    const fusedSignal = this.fuseAgentSignals(agentEvidence);
    
    // Generate market view
    const marketView = this.generateMarketView(fusedSignal, query);
    
    // Tailor recommendations to user profile
    const recommendations = this.tailorRecommendations(marketView, userProfile);
    
    // Generate summary
    const summary = this.generateSummary(marketView, recommendations);

    return {
      summary,
      market_view: marketView,
      recommendations,
      agent_evidence: agentEvidence,
      backtest_snapshot: this.generateBacktestSnapshot(),
      disclosures: [
        "This is research, not financial advice.",
        "Probabilities are model-based and can change.",
        "Past performance does not guarantee future results."
      ]
    };
  }

  private static detectQueryType(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('/chart') || lowerQuery.includes('technical')) return 'technical';
    if (lowerQuery.includes('/macro') || lowerQuery.includes('fed') || lowerQuery.includes('rates')) return 'macro';
    if (lowerQuery.includes('/onchain') || lowerQuery.includes('whale') || lowerQuery.includes('flow')) return 'onchain';
    if (lowerQuery.includes('/sentiment') || lowerQuery.includes('social') || lowerQuery.includes('twitter')) return 'sentiment';
    return 'general';
  }

  private static selectAgents(queryType: string): string[] {
    switch (queryType) {
      case 'technical': return ['Technical', 'Sentiment'];
      case 'macro': return ['Macro', 'Technical'];
      case 'onchain': return ['OnChain', 'Technical'];
      case 'sentiment': return ['Sentiment', 'OnChain'];
      default: return ['Sentiment', 'Macro', 'Technical', 'OnChain'];
    }
  }

  private static async simulateAgent(
    agent: string, 
    query: string, 
    context: QueryContext
  ): Promise<AgentEvidence> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const baseScore = (Math.random() - 0.5) * 3; // -1.5 to +1.5
    const regimeAdjustment = context.risk_regime === 'crisis' ? -0.5 : 
                           context.risk_regime === 'volatile' ? -0.2 : 0;
    
    const score = Math.max(-2, Math.min(2, baseScore + regimeAdjustment));
    const confidence = Math.round(60 + Math.random() * 30); // 60-90%

    switch (agent) {
      case 'Sentiment':
        return {
          agent: 'Sentiment',
          score,
          confidence,
          highlights: [
            score > 0 ? 'Bullish social momentum building' : 'Bearish sentiment dominates',
            `Fear & Greed at ${Math.round(30 + score * 20)}`,
            'Funding rates trending neutral',
            'Influencer alignment mixed'
          ],
          sources: ['Twitter API', 'Telegram', 'Reddit', 'Options Flow']
        };

      case 'Technical':
        const support = 62000 + Math.random() * 2000;
        const resistance = support + 3000 + Math.random() * 3000;
        return {
          agent: 'Technical',
          score,
          confidence,
          highlights: [
            `Key support at $${support.toFixed(0)}`,
            `Resistance cluster near $${resistance.toFixed(0)}`,
            score > 0 ? 'Bull flag pattern forming' : 'Bear flag breakdown risk',
            'Volume profile suggests accumulation'
          ],
          levels: {
            s: [support, support - 2000],
            r: [resistance, resistance + 2000]
          },
          patterns: [score > 0 ? 'Bull Flag' : 'Bear Flag', 'Ascending Triangle']
        };

      case 'Macro':
        return {
          agent: 'Macro',
          score,
          confidence,
          highlights: [
            context.risk_regime === 'crisis' ? 'Risk-off environment persists' : 'Risk appetite stable',
            'DXY strength creates headwinds',
            'Real yields elevated but stable',
            'Correlation with equities remains high'
          ],
          sources: ['Fed Wire', 'Treasury Data', 'DXY', 'VIX']
        };

      case 'OnChain':
        return {
          agent: 'OnChain',
          score,
          confidence,
          highlights: [
            score > 0 ? 'Exchange outflows accelerating' : 'Inflows to exchanges detected',
            'Whale accumulation patterns visible',
            'Active addresses trending higher',
            'Long-term holder selling minimal'
          ],
          flows: ['Coinbase: -2,450 BTC', 'Binance: +890 BTC', 'Kraken: -340 BTC'],
          contracts: ['Grayscale outflows slowing', 'ETF inflows steady']
        };

      default:
        throw new Error(`Unknown agent: ${agent}`);
    }
  }

  private static fuseAgentSignals(evidence: AgentEvidence[]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    evidence.forEach(agent => {
      const weight = this.getAgentWeight(agent.agent);
      const confidenceAdjustedScore = agent.score * (agent.confidence / 100);
      weightedSum += confidenceAdjustedScore * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private static getAgentWeight(agentType: string): number {
    switch (agentType) {
      case 'Sentiment': return this.FUSION_WEIGHTS.sentiment;
      case 'Macro': return this.FUSION_WEIGHTS.macro;
      case 'Technical': return this.FUSION_WEIGHTS.technical;
      case 'OnChain': return this.FUSION_WEIGHTS.onchain;
      default: return 0.25;
    }
  }

  private static generateMarketView(fusedSignal: number, query: string): MarketView {
    const asset = this.extractAsset(query) || 'BTC';
    const bias = fusedSignal > 0.3 ? 'bullish' : fusedSignal < -0.3 ? 'bearish' : 'neutral';
    const conviction = Math.round(Math.abs(fusedSignal) * 50 + 50);

    return {
      asset,
      timeframe: '1d',
      bias,
      conviction,
      key_levels: {
        support: [62350, 60000, 58500],
        resistance: [68200, 72000, 75500]
      },
      catalysts: [
        'Fed policy decision next week',
        'Options expiry Friday',
        'Quarterly earnings season'
      ],
      risks: [
        'Macro uncertainty elevated',
        'Technical breakdown below support',
        'Regulatory headline risk'
      ]
    };
  }

  private static extractAsset(query: string): string | null {
    const assets = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'UNI'];
    const upperQuery = query.toUpperCase();
    return assets.find(asset => upperQuery.includes(asset)) || null;
  }

  private static tailorRecommendations(
    marketView: MarketView, 
    userProfile: UserProfile
  ): Recommendation[] {
    const riskMultiplier = userProfile.risk_tolerance === 'high' ? 1.5 : 
                          userProfile.risk_tolerance === 'low' ? 0.5 : 1.0;
    
    const baseSize = userProfile.risk_tolerance === 'high' ? '2-3%' :
                    userProfile.risk_tolerance === 'low' ? '0.5-1%' : '1-2%';

    const timeHorizon = userProfile.horizon === 'long_term' ? 'position' : userProfile.horizon;

    if (marketView.bias === 'bullish') {
      return [{
        type: 'idea',
        entry_zone: `$${marketView.key_levels.support[0].toLocaleString()} - $${(marketView.key_levels.support[0] * 1.02).toLocaleString()}`,
        invalidation: `Below $${marketView.key_levels.support[1].toLocaleString()}`,
        targets: [
          `$${marketView.key_levels.resistance[0].toLocaleString()}`,
          `$${marketView.key_levels.resistance[1].toLocaleString()}`
        ],
        r_r: 2.3 * riskMultiplier,
        probability_win: 0.65,
        time_horizon: timeHorizon,
        sizing_guidance: `${baseSize} of portfolio`,
        fit_for_user: `Aligns with your ${userProfile.objective} strategy and ${userProfile.risk_tolerance} risk tolerance`
      }];
    } else if (marketView.bias === 'bearish') {
      return [{
        type: 'hedge',
        entry_zone: `Short near $${(marketView.key_levels.resistance[0] * 0.98).toLocaleString()}`,
        invalidation: `Above $${marketView.key_levels.resistance[0].toLocaleString()}`,
        targets: [
          `$${marketView.key_levels.support[0].toLocaleString()}`,
          `$${marketView.key_levels.support[1].toLocaleString()}`
        ],
        r_r: 1.8 * riskMultiplier,
        probability_win: 0.58,
        time_horizon: timeHorizon,
        sizing_guidance: `${baseSize} hedge position`,
        fit_for_user: `Protective hedge for your portfolio given current risk regime`
      }];
    } else {
      return [{
        type: 'alert',
        entry_zone: 'Wait for directional clarity',
        invalidation: `Break of $${marketView.key_levels.support[1].toLocaleString()} or $${marketView.key_levels.resistance[0].toLocaleString()}`,
        targets: ['Reassess after breakout'],
        r_r: 0,
        probability_win: 0,
        time_horizon: 'position',
        sizing_guidance: 'Maintain current allocation',
        fit_for_user: 'Conservative approach matches uncertain market conditions'
      }];
    }
  }

  private static generateSummary(marketView: MarketView, recommendations: Recommendation[]): string {
    const biasText = marketView.bias === 'bullish' ? 'showing bullish momentum' :
                    marketView.bias === 'bearish' ? 'facing bearish pressure' : 'in neutral consolidation';
    
    const actionText = recommendations[0]?.type === 'idea' ? 'consider long positions' :
                      recommendations[0]?.type === 'hedge' ? 'protective hedging recommended' :
                      'waiting for clearer signals';

    return `${marketView.asset} is ${biasText} with ${marketView.conviction}% conviction. Based on multi-agent analysis, ${actionText} near key levels.`;
  }

  private static generateBacktestSnapshot(): BacktestSnapshot {
    return {
      strategy_id: `strat_${Date.now()}`,
      sample_period: '2023-01 to 2024-12',
      n_trades: Math.round(50 + Math.random() * 100),
      win_rate: 0.58 + Math.random() * 0.15,
      expectancy: 0.15 + Math.random() * 0.20,
      max_dd: -(0.08 + Math.random() * 0.12),
      notes: 'Simulated backtest on similar market conditions'
    };
  }
}