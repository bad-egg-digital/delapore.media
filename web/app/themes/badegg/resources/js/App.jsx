import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './views/Home'
import Page from './views/Page'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:slug" element={<Page />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
