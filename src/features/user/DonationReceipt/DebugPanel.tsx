import React from 'react';

interface DebugPanelProps {
  data: object;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ data }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development mode
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '300px',
        height: '400px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '12px',
        overflow: 'auto',
        padding: '10px',
        zIndex: 1000,
        borderRadius: '8px 0 0 0',
        border: '1px solid #444',
      }}
    >
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', textAlign: 'center' }}>
        Context Debug
      </h3>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugPanel;
