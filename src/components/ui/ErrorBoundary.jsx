import React from 'react';
import { X } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Send to your logging service if you like
    console.error('ErrorBoundary caught:', error, info);
  }

  handleClose = () => {
    // Reset the boundary and try rendering children again
    this.setState({ hasError: false, error: null });
  };
  
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Error: render both the children *and* the overlay
    return (
      <>
        {/* keep the broken subtree mounted (but visually behind) */}
        {this.props.children}

        {/* full-page blur + modal on top */}
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 border-2 border-red-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">
                Something went wrong
              </h2>
              <button
                onClick={this.handleClose}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20}/>
              </button>
            </div>
            <div className="text-sm whitespace-pre-wrap max-h-60 overflow-auto p-2 bg-gray-50 border rounded">
              {this.state.error?.toString()}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={this.handleClose}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
