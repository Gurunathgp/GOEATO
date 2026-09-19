import React from 'react';
import Button from './Button.jsx';
import EmptyState from './EmptyState.jsx';
import { IconAlert } from './icons.jsx';

/**
 * ErrorBoundary component that catches JavaScript errors in child components
 * Displays a fallback UI when an error occurs
 * Includes error logging and recovery options
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // You could also send error details to an error tracking service here
    // Example: Sentry.captureException(error, { extra: errorInfo });

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <EmptyState
            icon={<IconAlert size={26} />}
            title="Something went wrong"
            description="We hit an unexpected error. It has been logged, and you can retry or refresh the page."
            action={
              <>
                <Button variant="primary" onClick={this.handleReset}>
                  Try again
                </Button>
                <Button variant="ghost" onClick={() => window.location.reload()}>
                  Refresh page
                </Button>
              </>
            }
          />

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ maxWidth: '600px', margin: '0 auto' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--danger)', fontWeight: 600, marginBottom: '12px' }}>
                Error details (development only)
              </summary>
              <pre style={{ background: 'var(--danger-bg)', padding: '16px', borderRadius: '8px', overflow: 'auto', fontSize: '12px' }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
