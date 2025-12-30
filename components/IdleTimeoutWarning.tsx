import React from 'react';
import { formatTimeRemaining } from '../hooks';

interface IdleTimeoutWarningProps {
  timeRemainingMs: number;
  onDismiss: () => void;
  onEndSession: () => void;
}

/**
 * Warning overlay shown when the session is about to timeout due to inactivity.
 * Gives the user a chance to continue or manually end the session.
 */
export const IdleTimeoutWarning: React.FC<IdleTimeoutWarningProps> = ({
  timeRemainingMs,
  onDismiss,
  onEndSession,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '32px 40px',
          maxWidth: '420px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 170, 51, 0.3)',
        }}
      >
        {/* Clock icon */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
          }}
        >
          ⏰
        </div>
        
        <h2
          style={{
            color: '#ffaa33',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          Session Timeout Warning
        </h2>
        
        <p
          style={{
            color: '#b0b0b0',
            fontSize: '16px',
            lineHeight: 1.5,
            marginBottom: '8px',
          }}
        >
          Your session has been inactive and will close in:
        </p>
        
        <div
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: timeRemainingMs < 60000 ? '#ff4444' : '#ffaa33',
            fontFamily: 'monospace',
            marginBottom: '24px',
            padding: '12px',
            backgroundColor: 'rgba(255, 170, 51, 0.1)',
            borderRadius: '8px',
          }}
        >
          {formatTimeRemaining(timeRemainingMs)}
        </div>
        
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onDismiss}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
          >
            I'm Still Here
          </button>
          
          <button
            onClick={onEndSession}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid #666',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: '#999',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ccc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#999';
            }}
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutWarning;

