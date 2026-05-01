import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('SpendIQ App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', gap: '16px', fontFamily: 'Inter, sans-serif', background: '#f0f4f4'
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: '#00685f', margin: 0 }}>Something went wrong</h2>
          <p style={{ color: '#6b7280', maxWidth: 400, textAlign: 'center', margin: 0 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/login'; }}
            style={{
              background: '#00685f', color: 'white', border: 'none', borderRadius: 12,
              padding: '12px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14
            }}
          >
            Return to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
