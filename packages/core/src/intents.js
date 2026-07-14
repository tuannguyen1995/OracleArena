"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOracleIntent = formatOracleIntent;
exports.submitOracleDataAsIntent = submitOracleDataAsIntent;
/**
 * Formats oracle data into a signed intent payload ready for submission to the Sphere Intent Market.
 */
function formatOracleIntent(data) {
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
async function submitOracleDataAsIntent(providers, data) {
    const intentPayload = formatOracleIntent(data);
    const signedIntent = await providers.wallet.signIntent(intentPayload);
    const txHash = await providers.intentMarket.submit(signedIntent);
    return txHash;
}
