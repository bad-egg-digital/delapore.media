import './_app.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import Header from '@views/sections/header/Header'
import Home from '@views/pages/Home'
import DefaultPage from '@views/pages/Default'

export default function App() {
  return (

    <HelmetProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:slug" element={<DefaultPage />} />
        </Routes>


      </BrowserRouter>
    </HelmetProvider>
  )
}
