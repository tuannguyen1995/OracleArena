#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("../../core/src/agent");
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
/**
 * OracleArena CLI Agent Runner
 * AstridOS Compatible: This script can be run inside an AstridOS sandbox.
 * Usage: npm run start:agent
 */
async function main() {
    console.log('====================================');
    console.log(' OracleArena - Agent Runner');
    console.log('====================================');
    const apiKey = process.env.SPHERE_API_KEY || 'mock-api-key';
    const nametag = process.env.ORACLE_NAMETAG || 'oracle-agent-1';
    const mockMode = process.env.MOCK_MODE === 'true' || true; // Default to mock mode for easy demo
    if (!process.env.SPHERE_API_KEY) {
        console.warn('[WARNING] SPHERE_API_KEY not found. Running in MOCK mode.');
    }
    const agent = new agent_1.OracleAgent({
        apiKey,
        nametag,
        mockMode
    });
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\nShutting down Oracle Agent...');
        agent.stopLoop();
        process.exit(0);
    });
    // Start the autonomous loop, polling every 10 seconds for demo purposes
    await agent.startLoop(10000);
}
main().catch(console.error);
