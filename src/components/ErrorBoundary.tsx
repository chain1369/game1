import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">应用出错了</h1>
            <p className="text-gray-300 mb-6">
              抱歉，应用遇到了一个错误。请刷新页面重试。
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                刷新页面
              </button>
              <details className="text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                  查看错误详情
                </summary>
                <div className="mt-2 p-3 bg-gray-700 rounded text-sm text-gray-300 font-mono">
                  {this.state.error?.message}
                </div>
              </details>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
