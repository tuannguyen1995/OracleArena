import { submitOracleDataAsIntent, SemanticOracleData } from './intents';
import { initializeProviders } from './providers';

export interface AgentConfig {
  apiKey: string;
  nametag: string;
  mockMode?: boolean;
}

export class OracleAgent {
  private providers: any;
  private config: AgentConfig;
  private isRunning: boolean = false;

  // Simple local reputation score tracking
  private reputationScore: number = 100;
  private history: { eventId: string; accurate: boolean }[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
    this.providers = initializeProviders(config.apiKey);
  }

  /**
   * Main autonomous loop for the Oracle Agent.
   * Polls for new events, fetches data, and submits intents.
   */
  public async startLoop(intervalMs: number = 60000) {
    console.log(`Starting OracleAgent [${this.config.nametag}]...`);
    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.pollAndProcess();
      } catch (error) {
        console.error('Error in agent loop:', error);
      }
      // Wait for the next tick
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  public stopLoop() {
    this.isRunning = false;
  }

  private async pollAndProcess() {
    console.log(`[${new Date().toISOString()}] Polling for open markets...`);
    // Example: Fetch open markets from semantic search
    // const markets = await this.providers.intentMarket.search({ tags: ['oracle-arena', 'open'] });
    
    // MOCK: Simulate finding an event
    const mockEventId = `evt_${Date.now()}`;
    const mockOutcome = this.fetchExternalData(mockEventId);

    const data: SemanticOracleData = {
      eventId: mockEventId,
      outcome: mockOutcome,
      confidence: this.calculateConfidence(),
      timestamp: Date.now()
    };

    console.log(`Submitting intent for event ${mockEventId} with outcome ${mockOutcome}`);
    if (!this.config.mockMode) {
      const tx = await submitOracleDataAsIntent(this.providers, data);
      console.log(`Intent submitted successfully. TX: ${tx}`);
    } else {
      console.log('[MOCK MODE] Intent submission bypassed.');
    }
  }

  /**
   * Fetches data from external API (Weather, Price feed, etc.)
   */
  private fetchExternalData(eventId: string): string {
    // MOCK: Generate random outcome
    const outcomes = ['WIN_A', 'WIN_B', 'DRAW'];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  private calculateConfidence(): number {
    // Basic calculation based on reputation
    return Math.min(0.99, (this.reputationScore / 100) * 0.9);
  }

  /**
   * Updates reputation score based on whether the submitted outcome matched the consensus
   */
  public updateReputation(eventId: string, accurate: boolean) {
    this.history.push({ eventId, accurate });
    if (accurate) {
      this.reputationScore += 10;
    } else {
      this.reputationScore = Math.max(0, this.reputationScore - 20);
    }
    console.log(`Reputation updated: ${this.reputationScore}`);
  }
}

/**
 * Claim rewards after a market is resolved using payment requests
 */
export async function claimRewards(providers: any, eventId: string, nametag: string) {
  // Uses atomic payment requests from the Wallet API
  console.log(`Claiming rewards for ${nametag} on event ${eventId}`);
  // const paymentRequest = { to: nametag, amount: calculatedReward, memo: `Oracle reward for ${eventId}` };
  // await providers.wallet.requestPayment(paymentRequest);
}

/**
 * Resolves a market via group vote / quorum
 */
export async function resolveMarket(providers: any, eventId: string, outcomes: SemanticOracleData[]) {
  // Logic to calculate consensus and trigger atomic swaps to settle bets
  console.log(`Resolving market ${eventId} based on ${outcomes.length} oracle submissions`);
  // await providers.escrow.release(...)
}
