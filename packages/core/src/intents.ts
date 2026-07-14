import { IntentParams } from './mock-sdk';

export interface SemanticOracleData {
  eventId: string;
  outcome: string;
  confidence: number; // 0 to 1
  timestamp: number;
}

/**
 * Formats oracle data into a signed intent payload ready for submission to the Sphere Intent Market.
 */
export function formatOracleIntent(data: SemanticOracleData): IntentParams {
  return {
    semanticData: JSON.stringify(data),
    action: 'oracle_submission',
    tags: ['oracle-arena', data.eventId],
    expiresAt: Date.now() + 1000 * 60 * 60 // 1 hour validity
  };
}

/**
 * Submits the oracle data as a signed intent via the Wallet API provider
 */
export async function submitOracleDataAsIntent(providers: any, data: SemanticOracleData) {
  const intentPayload = formatOracleIntent(data);
  const signedIntent = await providers.wallet.signIntent(intentPayload);
  const txHash = await providers.intentMarket.submit(signedIntent);
  return txHash;
}
