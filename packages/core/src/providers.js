"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProviders = initializeProviders;
const mock_sdk_1 = require("./mock-sdk");
/**
 * Setup Unicity Sphere SDK v2 providers
 */
function initializeProviders(apiKey) {
    // Base provider connected to Unicity Testnet v2
    const base = (0, mock_sdk_1.createNodeProviders)({
        network: 'testnet',
        oracle: { apiKey }
    });
    // Wallet API provider for handling signed intents and transactions
    const providers = (0, mock_sdk_1.createWalletApiProviders)(base, {
        baseUrl: 'https://wallet-api.unicity.network'
    });
    return providers;
}
