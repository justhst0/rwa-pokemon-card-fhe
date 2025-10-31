import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './config/wagmi';
import { PokemonApp } from './components/PokemonApp';

const queryClient = new QueryClient();

function App() {
  const [tab, setTab] = useState<'mint' | 'view' | 'transfer'>('mint');
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en">
          <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#E8F4F8',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated Gradient Background Layers - Ocean Blue Theme */}
            <div
              className="animated-gradient-bg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                backgroundImage: `
                  radial-gradient(circle 800px at 20% 100%, rgba(135,206,250,0.3), transparent),
                  radial-gradient(circle 750px at 100% 80%, rgba(176,224,230,0.35), transparent),
                  radial-gradient(circle 600px at 50% 50%, rgba(240,248,255,0.4), transparent),
                  radial-gradient(circle 500px at 80% 20%, rgba(173,216,230,0.25), transparent)
                `,
                backgroundSize: "110% 110%, 110% 110%, 105% 105%, 100% 100%",
              }}
            />
            {/* Additional animated layer for wave effect */}
            <div
              className="animated-gradient-layer"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                backgroundImage: `
                  radial-gradient(circle 900px at 30% 90%, rgba(135,206,250,0.2), transparent),
                  radial-gradient(circle 700px at 70% 10%, rgba(176,224,230,0.25), transparent),
                  radial-gradient(circle 550px at 10% 50%, rgba(173,216,230,0.18), transparent)
                `,
                backgroundSize: "115% 115%, 110% 110%, 105% 105%",
                mixBlendMode: 'multiply',
                opacity: 0.6,
              }}
            />

            {/* Header */}
            <div style={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.75)',
              borderBottom: '1px solid rgba(173, 216, 230, 0.3)',
              boxShadow: '0 4px 20px rgba(135, 206, 250, 0.15)',
              position: 'relative',
              zIndex: 10
            }}>
              {/* Header Content */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {/* Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(135, 206, 250, 0.2)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <img 
                      src="/logo.png" 
                      alt="Logo" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        console.error('Logo not found at /logo.png');
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h1 style={{
                      margin: 0,
                      fontSize: '1.75rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #4169E1, #87CEEB, #B0E0E6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.02em'
                    }}>
                      Encrypt RWA Pokemon Cards
                    </h1>
                    <p style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#5F9EA0',
                      fontWeight: '500',
                      letterSpacing: '0.05em'
                    }}>
                      Confidential NFT Ownership with FHE
                    </p>
                  </div>
                </div>

                {/* Navigation Tabs - Center */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  flex: '1 1 auto',
                  minWidth: 0
                }}>
              <button 
                className={`tab ${tab === 'mint' ? 'active' : ''}`}
                onClick={() => setTab('mint')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid transparent',
                  background: tab === 'mint' 
                    ? 'linear-gradient(135deg, #4169E1, #87CEEB)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: tab === 'mint' ? 'white' : '#4169E1',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: tab === 'mint' 
                    ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transform: tab === 'mint' ? 'translateY(-2px)' : 'none'
                }}
              >
                Mint Card
              </button>
              <button 
                className={`tab ${tab === 'view' ? 'active' : ''}`}
                onClick={() => setTab('view')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid transparent',
                  background: tab === 'view' 
                    ? 'linear-gradient(135deg, #4169E1, #87CEEB)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: tab === 'view' ? 'white' : '#4169E1',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: tab === 'view' 
                    ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transform: tab === 'view' ? 'translateY(-2px)' : 'none'
                }}
              >
                View Card
              </button>
              <button 
                className={`tab ${tab === 'transfer' ? 'active' : ''}`}
                onClick={() => setTab('transfer')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid transparent',
                  background: tab === 'transfer' 
                    ? 'linear-gradient(135deg, #4169E1, #87CEEB)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: tab === 'transfer' ? 'white' : '#4169E1',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: tab === 'transfer' 
                    ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transform: tab === 'transfer' ? 'translateY(-2px)' : 'none'
                }}
              >
                Transfer Card
              </button>
                </div>

                {/* Connect Button */}
                <div style={{ flexShrink: 0 }}>
                  <ConnectButton />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              paddingTop: '0'
            }}>
              <PokemonApp tab={tab} />
            </div>

          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App
