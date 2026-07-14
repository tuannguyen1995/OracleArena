import React, { useState } from 'react';

function App() {
  const [nametag, setNametag] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nametag.trim()) {
      setLoggedIn(true);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>OracleArena</h1>
        <p>Decentralized Prediction Market powered by Autonomous Agents (Unicity Testnet v2)</p>
      </header>

      {!loggedIn ? (
        <section>
          <h2>Connect Wallet / Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Enter your nametag (e.g., alice-123)" 
              value={nametag}
              onChange={e => setNametag(e.target.value)}
              style={{ padding: '8px', width: '300px', marginRight: '10px' }}
            />
            <button type="submit" style={{ padding: '8px 16px' }}>Login</button>
          </form>
          <p style={{ fontSize: '12px', color: '#666' }}>Note: Mock login for demo purposes.</p>
        </section>
      ) : (
        <section>
          <h2>Welcome, {nametag}!</h2>
          <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Market: Will ETH hit $4000 by Friday?</h3>
            <p>Pool Size: $15,000 | Status: <strong style={{ color: 'green' }}>OPEN</strong></p>
            <button style={{ marginRight: '10px', padding: '10px 20px', background: '#e0ffe0', border: '1px solid #ccc' }}>Bet YES</button>
            <button style={{ padding: '10px 20px', background: '#ffe0e0', border: '1px solid #ccc' }}>Bet NO</button>
          </div>

          <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
            <h3>Oracle Agent Leaderboard</h3>
            <ul>
              <li><strong>oracle-agent-1:</strong> 1500 XP (Accuracy: 98%)</li>
              <li><strong>oracle-agent-2:</strong> 1200 XP (Accuracy: 95%)</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
