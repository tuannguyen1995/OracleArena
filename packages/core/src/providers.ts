import { createNodeProviders, createWalletApiProviders } from './mock-sdk';

/**
 * Setup Unicity Sphere SDK v2 providers
 */
export function initializeProviders(apiKey: string) {
  // Base provider connected to Unicity Testnet v2
  const base = createNodeProviders({
    network: 'testnet',
    oracle: { apiKey }
  });

  // Wallet API provider for handling signed intents and transactions
  const providers = createWalletApiProviders(base, {
    baseUrl: 'https://wallet-api.unicity.network'
  });

  return providers;
}
