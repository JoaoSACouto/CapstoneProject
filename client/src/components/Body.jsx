import { createBrowserRouter, RouterProvider } from 'react-router'
import { lazy, Suspense } from 'react'
import LoadingState from './LoadingState'
import Browse from './Browse'
import Home from './Home'
import ScrollToTop from './ScrollToTop'
import { UI_TEXT } from '../utils/constants/ui'

// Lazy load heavy components
const Login = lazy(() => import('./Login').then((m) => ({ default: m.Login })))
const Edit = lazy(() => import('./Edit/Edit'))
const Detail = lazy(() =>
  import('./Detail').then((m) => ({ default: m.Detail }))
)
const Create = lazy(() => import('./Create/Create'))
const Explore = lazy(() =>
  import('./Explore').then((m) => ({ default: m.Explore }))
)
const ErrorPage = lazy(() => import('./ErrorPage'))
const Donate = lazy(() => import('./Donate'))
const Profile = lazy(() => import('./Profile'))

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: (
        <ScrollToTop>
          <Browse />
        </ScrollToTop>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'restaurant/:slug',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Detail />
            </Suspense>
          ),
        },
        {
          path: 'create',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Create />
            </Suspense>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Edit />
            </Suspense>
          ),
        },
        {
          path: 'profile',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: 'donate',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Donate />
            </Suspense>
          ),
        },
        {
          path: 'donate/success',
          element: (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
                <p className="text-gray-600 mb-6">Your donation was successful. We appreciate your support!</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </div>
          ),
        },
        {
          path: 'donate/cancel',
          element: (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <div className="text-yellow-500 text-6xl mb-4">⚠</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-6">Your donation was cancelled. No charges were made.</p>
                <button 
                  onClick={() => window.location.href = '/donate'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </div>
          ),
        },
        {
          path: 'explore',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Explore />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '/login',
      element: (
        <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: '*', // Catch-all route for 404
      element: (
        <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
          <ErrorPage />
        </Suspense>
      ),
    },
  ])

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body
