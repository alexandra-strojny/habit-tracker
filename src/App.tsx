import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './AppRoutes'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background-light h-screen">
        <AppRoutes />
      </div>
    </QueryClientProvider>
  )
}

export default App
