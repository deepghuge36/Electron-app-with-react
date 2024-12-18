import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

import './global.css'
import Translation from './pages/Translation'
import { ROUE_ABOUT, ROUE_HOME, ROUTE_TRANSLATION, ROUTE_TRANSLATION_VIEW } from './pathConstant'
import TranslationView from './pages/TranslationView'

const AppRoutes = () => {
  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        <Route path={ROUTE_TRANSLATION} element={<Translation />} />
        <Route path={ROUTE_TRANSLATION_VIEW} element={<TranslationView />} />
        <Route path={ROUE_HOME} element={<Home />} />
        <Route path={ROUE_ABOUT} element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
