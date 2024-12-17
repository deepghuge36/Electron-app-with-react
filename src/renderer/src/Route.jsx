import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import NavBar from './components/Navbar'

import './global.css'
import Translation from './pages/Translation'
// import './assets/js/lib/html2canvas.min.js'

const AppRoutes = () => {
  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/translation" element={<Translation />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
