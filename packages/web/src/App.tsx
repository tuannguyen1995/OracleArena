import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, Activity, TrendingUp, Cpu, ChevronRight, ShieldCheck, 
  Zap, ArrowUpRight, BarChart3, Clock, CheckCircle2, Globe, GitBranch,
  MessageSquare
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Mock Data
const INITIAL_BALANCE = 10000;
const AGENT_NAMES = ['AlphaOracle', 'CryptoMind', 'DataSwarm', 'MarketSentinel', 'NexusAI'];
const MARKETS = [
  { id: 1, title: "Will Ethereum (ETH) hit $4,000 by Friday?", pool: 15420, oddsYes: 68, status: 'LIVE', category: 'Crypto' },
  { id: 2, title: "Will GPT-5 be announced before Q4 2026?", pool: 8950, oddsYes: 42, status: 'LIVE', category: 'AI' },
  { id: 3, title: "US Federal Reserve to cut rates in September?", pool: 24100, oddsYes: 81, status: 'LIVE', category: 'Finance' }
];

interface AgentLog {
  id: string;
  agent: string;
  action: string;
  amount: number;
  marketId: number;
  time: Date;
  side: 'YES' | 'NO';
}

interface UserBet {
  id: string;
  marketId: number;
  side: 'YES' | 'NO';
  amount: number;
  time: string; // Stored as ISO string to prevent JSON parse crash
  txHash: string;
}

function App() {
  const [nametag, setNametag] = useState(() => localStorage.getItem('oracle_nametag') || '');
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('oracle_loggedIn') === 'true');
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('oracle_balance');
    return saved ? Number(saved) : INITIAL_BALANCE;
  });
  const [activeMarket, setActiveMarket] = useState(MARKETS[0]);
  const [isBetting, setIsBetting] = useState<'YES' | 'NO' | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [showHistory, setShowHistory] = useState(false);
  const [userBets, setUserBets] = useState<UserBet[]>(() => {
    try {
      const saved = localStorage.getItem('oracle_userBets');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  
  // Real-time simulated state
  const [markets, setMarkets] = useState(MARKETS);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current && logsEndRef.current.parentElement) {
      logsEndRef.current.parentElement.scrollTop = logsEndRef.current.parentElement.scrollHeight;
    }
  }, [agentLogs]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('oracle_nametag', nametag);
    localStorage.setItem('oracle_loggedIn', String(loggedIn));
    localStorage.setItem('oracle_balance', String(balance));
    localStorage.setItem('oracle_userBets', JSON.stringify(userBets));
  }, [nametag, loggedIn, balance, userBets]);

  // Simulate Live Agent Activity
  useEffect(() => {
    if (!loggedIn) return;

    const interval = setInterval(() => {
      // Randomly update pool size
      setMarkets(prev => prev.map(m => {
        if (Math.random() > 0.5) {
          return { ...m, pool: m.pool + Math.floor(Math.random() * 500), oddsYes: Math.max(10, Math.min(90, m.oddsYes + (Math.random() > 0.5 ? 1 : -1))) };
        }
        return m;
      }));

      // Randomly push agent log
      if (Math.random() > 0.4) {
        const agent = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
        const market = MARKETS[Math.floor(Math.random() * MARKETS.length)];
        const side = Math.random() > 0.5 ? 'YES' : 'NO';
        const amount = Math.floor(Math.random() * 1000) + 50;
        
        const newLog: AgentLog = {
          id: Math.random().toString(36).substr(2, 9),
          agent,
          action: 'staked',
          amount,
          marketId: market.id,
          time: new Date(),
          side
        };

        setAgentLogs(prev => [...prev.slice(-15), newLog]); // Keep last 15
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [loggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nametag.trim()) {
      const loadingToast = toast.loading('Connecting wallet securely...');
      setTimeout(() => {
        toast.success(`Welcome back, ${nametag}!`, { id: loadingToast });
        setLoggedIn(true);
      }, 1000);
    }
  };

  const handleBet = (side: 'YES' | 'NO') => {
    if (betAmount <= 0) {
      toast.error("Bet amount must be greater than 0!");
      return;
    }
    if (balance < betAmount) {
      toast.error("Insufficient balance!");
      return;
    }

    setIsBetting(side);
    
    setTimeout(() => {
      setBalance(prev => prev - betAmount);
      
      // Update pool visually
      setMarkets(prev => prev.map(m => 
        m.id === activeMarket.id 
          ? { ...m, pool: m.pool + betAmount, oddsYes: side === 'YES' ? Math.min(99, m.oddsYes + 1) : Math.max(1, m.oddsYes - 1) } 
          : m
      ));
      
      setActiveMarket(prev => ({ 
        ...prev, 
        pool: prev.pool + betAmount,
        oddsYes: side === 'YES' ? Math.min(99, prev.oddsYes + 1) : Math.max(1, prev.oddsYes - 1)
      }));

      const newBet: UserBet = {
        id: Math.random().toString(36).substring(7),
        marketId: activeMarket.id,
        side,
        amount: betAmount,
        time: new Date().toISOString(),
        txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
      };
      setUserBets(prev => [newBet, ...prev]);

      setIsBetting(null);
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-fade-in' : ''} glass-panel`} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(20, 20, 25, 0.95)', border: `1px solid ${side === 'YES' ? 'var(--success)' : 'var(--danger)'}` }}>
          <CheckCircle2 color={side === 'YES' ? 'var(--success)' : 'var(--danger)'} size={24} />
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Bet Placed Successfully</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>-{betAmount} USDC on {side}</p>
          </div>
        </div>
      ), { duration: 3000 });
    }, 1200);
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1e1e24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={28} color="var(--primary-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
              Oracle<span className="text-gradient">Arena</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={16}/> Markets</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={16}/> Agents</a>
            {loggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setShowHistory(true)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '8px 16px', fontSize: '0.9rem' }}>
                  <Clock size={16} /> History
                </button>
                <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--surface-border)' }}>
                  <Wallet size={16} color="var(--primary-color)" />
                  <span style={{ fontWeight: '600' }}>{balance.toLocaleString()} USDC</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }} />
                  <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{nametag}</span>
                </div>
                <button 
                  onClick={() => {
                    setLoggedIn(false);
                    setNametag('');
                    localStorage.removeItem('oracle_loggedIn');
                    localStorage.removeItem('oracle_nametag');
                  }}
                  style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => document.getElementById('login-input')?.focus()}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', minHeight: 'calc(100vh - 160px)' }}>
        {!loggedIn ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ maxWidth: '500px', margin: '60px auto 0' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
                The Future of <br/><span className="text-gradient">Prediction Markets</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Powered by Unicity Testnet v2. Bet alongside autonomous AI agents with provable execution and zero latency.
              </p>
            </div>

            <section className="glass-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '10px' }}>
                  <Wallet size={24} color="var(--primary-color)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Demo Login</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No real funds required for hackathon</p>
                </div>
              </div>
              
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  id="login-input"
                  type="text" 
                  className="input-field"
                  placeholder="Choose a cool nametag (e.g., degenspartan)" 
                  value={nametag}
                  onChange={e => setNametag(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.05rem' }}>
                  Enter Arena <ChevronRight size={20} />
                </button>
              </form>
            </section>
          </motion.div>
        ) : (
          <div className="dashboard-grid">
            {/* Left Column: Markets & Trading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={24} color="var(--primary-color)" /> Live Markets
                </h2>
                
                {/* Market Selector */}
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }} className="custom-scrollbar">
                  {markets.map(market => (
                    <div 
                      key={market.id}
                      onClick={() => setActiveMarket(market)}
                      className={`glass-panel market-card ${activeMarket.id === market.id ? 'active' : ''}`}
                      style={{ padding: '16px', minWidth: '280px', flex: '0 0 auto' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <span>{market.category}</span>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span> LIVE
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '12px', lineHeight: 1.3 }}>{market.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>{market.oddsYes}% <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>YES</span></span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>${market.pool.toLocaleString()} Pool</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trading Interface */}
              <motion.section 
                key={activeMarket.id}
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="glass-panel" 
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Background gradient blur */}
                <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'var(--accent-glow)', filter: 'blur(100px)', borderRadius: '50%', opacity: 0.5, pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', position: 'relative' }}>
                  <h3 style={{ fontSize: '1.8rem', maxWidth: '80%', lineHeight: 1.2 }}>{activeMarket.title}</h3>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Total Pool</div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', fontFamily: 'monospace' }}>${activeMarket.pool.toLocaleString()}</div>
                  </div>
                </div>

                {/* Probability Bar */}
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: '600' }}>
                    <span style={{ color: 'var(--success)' }}>YES ({activeMarket.oddsYes}%)</span>
                    <span style={{ color: 'var(--danger)' }}>NO ({100 - activeMarket.oddsYes}%)</span>
                  </div>
                  <div style={{ height: '12px', background: 'var(--danger-bg)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                    <motion.div 
                      animate={{ width: `${activeMarket.oddsYes}%` }} 
                      transition={{ type: 'spring', bounce: 0, duration: 1 }}
                      style={{ height: '100%', background: 'var(--success)' }} 
                    />
                  </div>
                </div>

                {/* Trading Controls */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ fontWeight: '600' }}>Place Prediction</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[50, 100, 500].map(amount => (
                          <button 
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            style={{ 
                              background: betAmount === amount ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', 
                              border: '1px solid var(--surface-border)', 
                              color: 'white', 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ${amount}
                          </button>
                        ))}
                        <button 
                          onClick={() => setBetAmount(balance)}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', color: 'var(--warning)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                        >
                          MAX
                        </button>
                      </div>
                      <input 
                        type="number" 
                        value={betAmount} 
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--surface-border)', color: 'white', fontWeight: 'bold', marginLeft: '4px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button 
                      onClick={() => handleBet('YES')}
                      disabled={isBetting !== null || betAmount <= 0}
                      className="btn btn-success" 
                      style={{ padding: '20px', fontSize: '1.2rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
                    >
                      {isBetting === 'YES' ? <span className="loader animate-spin" /> : 'Buy YES'}
                      <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 'normal' }}>Payout: {(betAmount / activeMarket.oddsYes * 100).toFixed(2)} USDC</span>
                    </button>
                    <button 
                      onClick={() => handleBet('NO')}
                      disabled={isBetting !== null || betAmount <= 0}
                      className="btn btn-danger" 
                      style={{ padding: '20px', fontSize: '1.2rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
                    >
                      {isBetting === 'NO' ? <span className="loader animate-spin" /> : 'Buy NO'}
                      <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 'normal' }}>Payout: {(betAmount / (100 - activeMarket.oddsYes) * 100).toFixed(2)} USDC</span>
                    </button>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Right Column: Agent Activity Feed */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <section className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>
                  <Cpu size={20} color="var(--primary-color)" />
                  <h3 style={{ fontSize: '1.2rem' }}>Live Agent Feed</h3>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success)' }}>
                    <span className="animate-spin" style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'var(--success)', borderRightColor: 'var(--success)' }}></span>
                    Syncing Unicity
                  </div>
                </div>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: '500px', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <AnimatePresence initial={false}>
                    {agentLogs.length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', fontSize: '0.9rem' }}>
                        Waiting for agent activity...
                      </div>
                    ) : (
                      agentLogs.map((log) => (
                        <motion.div 
                          key={log.id}
                          initial={{ opacity: 0, x: 20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          className="agent-log-item"
                          style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${log.side === 'YES' ? 'var(--success)' : 'var(--danger)'}` }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={12}/> {log.agent}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.time.toLocaleTimeString()}</span>
                          </div>
                          <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                            Predicted <strong style={{ color: log.side === 'YES' ? 'var(--success)' : 'var(--danger)' }}>{log.side}</strong> with <strong>${log.amount}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              on: {MARKETS.find(m => m.id === log.marketId)?.title}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </AnimatePresence>
                </div>
              </section>
            </motion.div>
          </div>
        )}
      </main>

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: 'rgba(20, 20, 25, 0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock /> Betting History</h2>
              <button onClick={() => setShowHistory(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            
            <div className="custom-scrollbar" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userBets.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>No bets placed yet.</p>
              ) : (
                userBets.map(bet => (
                  <div key={bet.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `4px solid ${bet.side === 'YES' ? 'var(--success)' : 'var(--danger)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>{MARKETS.find(m => m.id === bet.marketId)?.title || 'Unknown Market'}</span>
                      <span style={{ color: bet.side === 'YES' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>{bet.side}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{bet.amount} USDC</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(bet.time).toLocaleString()}
                        </div>
                        {bet.txHash && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', marginTop: '4px', fontFamily: 'monospace', opacity: 0.7 }}>
                            Tx: {bet.txHash.substring(0, 6)}...{bet.txHash.substring(bet.txHash.length - 4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--surface-border)', padding: '40px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
            <Activity size={20} />
            <span style={{ fontWeight: '600' }}>OracleArena</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Built for Unicity Builder Program 2026. This is a Testnet demo.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><GitBranch size={20} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><MessageSquare size={20} /></a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
