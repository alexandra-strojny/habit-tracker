import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from './dashboard/Dashboard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='bg-background-light w-full h-screen p-8'>
        <Dashboard />
      </div>
    </QueryClientProvider>
  )
}

export default App
