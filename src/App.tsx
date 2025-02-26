import Analyze from './components/Analyze'
import YouTubeCommentAnalysis from './components/YouTubeCommentAnalysis'

const App = () => {
  return (
    <main style={{ marginLeft: '33%', marginTop:'10%' }}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <YouTubeCommentAnalysis />
    </div>
    <Analyze />
    </main>
  )
}

export default App
