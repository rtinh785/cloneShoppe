import { Component, type ErrorInfo, type ReactNode } from 'react'

import path from '../../constants/path'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className='bg-white-900 grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8'>
          <div className='text-center'>
            <p className='text-base font-semibold text-orange-600'>500</p>
            <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-orange-600 sm:text-7xl'>
              Error!
            </h1>

            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <a
                href={path.home}
                className='rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
              >
                Trở lại trang chủ
              </a>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
