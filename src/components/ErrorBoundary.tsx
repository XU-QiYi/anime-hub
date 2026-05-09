import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
          <h1 className="text-2xl font-bold mb-4">页面出错了</h1>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            {this.state.error?.message || '发生了未知错误'}
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium transition-colors"
          >
            返回首页
          </Link>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
