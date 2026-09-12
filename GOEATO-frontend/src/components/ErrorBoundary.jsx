import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <h2>Something went wrong</h2>
          <p className="muted">Please refresh the page and try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
