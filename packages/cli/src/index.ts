#!/usr/bin/env node
import { OracleAgent } from '../../core/src/agent';
import * as dotenv from 'dotenv';

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

  const agent = new OracleAgent({
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
