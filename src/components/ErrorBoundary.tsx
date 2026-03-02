import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-8">
          <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Etwas ist schiefgelaufen</h2>
            <p className="text-slate-600 mb-6">
              {this.state.error?.message ?? 'Ein unerwarteter Fehler ist aufgetreten.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
