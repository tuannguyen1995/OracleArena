import React, { useState } from 'react';
import { Wallet, Activity, TrendingUp, Cpu, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import './index.css';

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <Activity size={36} color="var(--primary-color)" />
          <h1 style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-1px' }}>
            Oracle<span className="text-gradient">Arena</span>
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Decentralized Prediction Market powered by Autonomous Agents on the Unicity Testnet v2.
        </p>
      </header>

      {!loggedIn ? (
        <section className="glass-panel animate-fade-in stagger-1" style={{ maxWidth: '450px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Wallet size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Connect Your Identity</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter a nametag to simulate a wallet connection and start betting.</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              className="input-field"
              placeholder="Enter your nametag (e.g., alice-123)" 
              value={nametag}
              onChange={e => setNametag(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '14px' }}>
              Connect Identity <ChevronRight size={18} />
            </button>
          </form>
          
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShieldCheck size={14} />
            <span>Secure mock login for hackathon demo</span>
          </div>
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }} className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Welcome back, <span className="text-gradient">{nametag}</span>
            </h2>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '20px', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600' }}>
              Balance: 1,500 USDC
            </div>
          </div>

          <section className="glass-panel animate-fade-in stagger-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={20} color="var(--primary-color)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Featured Market</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Will Ethereum (ETH) hit $4,000 by Friday?</h3>
              </div>
              <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                ● LIVE
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', padding: '16px 0' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Total Pool Size</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>$15,000.00</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Current Odds (YES)</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)' }}>68%</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button className="btn btn-success" style={{ padding: '16px', fontSize: '1.1rem' }}>
                Bet YES <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>(Returns 1.47x)</span>
              </button>
              <button className="btn btn-danger" style={{ padding: '16px', fontSize: '1.1rem' }}>
                Bet NO <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>(Returns 2.1x)</span>
              </button>
            </div>
          </section>

          <section className="glass-panel animate-fade-in stagger-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Cpu size={24} color="var(--primary-color)" />
              <h3 style={{ fontSize: '1.3rem' }}>Oracle Agent Leaderboard</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'oracle-agent-alpha', xp: 1500, acc: 98, active: true },
                { name: 'oracle-agent-beta', xp: 1240, acc: 94, active: true },
                { name: 'oracle-agent-gamma', xp: 890, acc: 88, active: false },
              ].map((agent, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>#{i + 1}</span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1.1rem' }}>{agent.name}</strong>
                        {agent.active && <Zap size={14} color="#eab308" style={{ fill: '#eab308' }} />}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Accuracy: <span style={{ color: agent.acc > 90 ? 'var(--success)' : 'inherit' }}>{agent.acc}%</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>{agent.xp}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>XP Earned</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
