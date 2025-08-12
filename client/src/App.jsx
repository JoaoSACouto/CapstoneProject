import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './utils/apolloClient'
import appStore from './utils/appStore'
import { AuthManager } from './hooks'
import Body from './components/Body'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <Provider store={appStore}>
          <AuthManager>
            <Body />
          </AuthManager>
        </Provider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default App
