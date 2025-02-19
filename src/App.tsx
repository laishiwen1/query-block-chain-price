import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import QueryPrice from './components/QueryPrice'
import About from './components/About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={QueryPrice}/>
        <Route path="/about" Component={About}/>
      </Routes>
    </Router>
  )
}

export default App
