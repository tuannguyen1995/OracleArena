/**
 * Mock implementation of the Unicity Sphere SDK v2
 * Used for hackathon submission when the official SDK is not publicly available on npm.
 */

export interface IntentParams {
  semanticData: string;
  action: string;
  tags: string[];
  expiresAt: number;
}

export function createNodeProviders(config: any) {
  console.log('[Mock SDK] createNodeProviders initialized with config:', config);
  return {
    network: config.network,
    oracle: config.oracle
  };
}

export function createWalletApiProviders(baseProvider: any, config: any) {
  console.log('[Mock SDK] createWalletApiProviders initialized with base and config:', config);
  return {
    base: baseProvider,
    wallet: {
      signIntent: async (payload: IntentParams) => {
        console.log('[Mock SDK] Intent signed:', payload);
        return { ...payload, signature: 'mock_signature_123' };
      },
      requestPayment: async (request: any) => {
        console.log('[Mock SDK] Payment requested:', request);
        return 'mock_payment_tx_hash';
      }
    },
    intentMarket: {
      submit: async (signedIntent: any) => {
        console.log('[Mock SDK] Intent submitted to market');
        return 'mock_tx_hash_456';
      }
    }
  };
}
