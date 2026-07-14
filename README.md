# OracleArena - On-Chain Prediction & Oracle Network Agent

**Unicity Builder Program Submission**
- **Track**: Games (primary) + Payments and Markets (secondary)
- **Status**: Fully Agentic
- **AstridOS Status**: Compatible (CLI Sandbox Ready)
- **Tech Stack**: TypeScript, Node.js, Vite, React, `@unicitylabs/sphere-sdk` (v2)

## Overview

OracleArena is a decentralized prediction market and oracle network where users and agents bet on real-world events. Specialized Oracle Agents compete to provide accurate data, earn rewards, and trigger automatic settlements.

### Why this is Agentic (XP Optimization)
This project is not just a UI for smart contracts. It implements a fully autonomous **Oracle Agent** that runs in a continuous loop (`packages/cli`). 
- **Autonomous Polling**: Agents monitor events and fetch external real-world data without human intervention.
- **Signed Intents**: Data is submitted securely as Signed Intents to the Unicity intent market.
- **Agent Coordination**: Oracles use Nostr group chat to form quorums and resolve disputes automatically.
- **Self-Governing Settlement**: The agents collectively trigger atomic swaps and payment requests to distribute payouts based on a localized reputation scoring system.

## Setup Instructions (Unicity Testnet v2)

This repository is structured as an npm monorepo (workspaces).

### Prerequisites
- Node.js >= 18
- Unicity Testnet v2 API Key

### Installation
```bash
# Install dependencies across all packages
npm install
```

### Running the Oracle Agent (CLI)
To run the autonomous agent, you need to set your environment variables.
```bash
# In packages/cli/.env
SPHERE_API_KEY=your_testnet_v2_api_key
ORACLE_NAMETAG=your-nametag
MOCK_MODE=true
```
Start the agent:
```bash
npm run start:agent
```
*Note: This will start the autonomous loop. You will see logs of the agent polling, fetching mock data, and simulating intent submission.*

### Running the Web UI (Live Demo)
Start the frontend interface to view markets and place bets:
```bash
npm run dev:web
```

## AstridOS Sandbox Setup
The Oracle Agent (`packages/cli`) is designed to be lightweight and run within an AstridOS sandbox.
1. Copy the `dist` output from `@oracle-arena/cli` and `@oracle-arena/core`.
2. Provide the `SPHERE_API_KEY` via AstridOS secrets injection.
3. Execute `node dist/index.js` in the sandbox environment.

## Architecture

- **`packages/core`**: Contains the SDK abstractions (`providers.ts`), intent signing (`intents.ts`), autonomous loop and reputation logic (`agent.ts`), atomic swaps (`settlement.ts`), and Nostr coordination (`nostr.ts`).
- **`packages/cli`**: The Node.js runner for the Oracle Agent.
- **`packages/web`**: A React + Vite dashboard for interacting with the prediction market.
