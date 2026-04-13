import { Helmet } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect, useState } from 'react'

import Header from '@views/sections/header/Header'
import Archive from '@views/templates/archive/Archive'
import Page from '@views/templates/page/Page'

export default function App() {
  const [ appLoaded, setAppLoaded ] = useState(false)
  const [ companyName, setCompanyName ] = useState('Loading...')
  const [ pageForPosts, setPageForPosts ] = useState('Loading...')

  useEffect(() => {
    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          badEgg {
            archiveObjects {
              post {
                slug
              }
            }
          }
          badEggCup {
            company {
              name
            }
          }
        }
      ` }),
    })
      .then(res => res.json())
      .then(res => {
        setPageForPosts(res.data.badEgg.archiveObjects.post.slug);
        setCompanyName(res.data.badEggCup.company.name)
        setAppLoaded(true);
      })
  }, [])

  return (

    <HelmetProvider>
      <Helmet>
        <title>{ companyName }</title>
        <meta name="description" content="Dynamic page from WordPress" />

        <meta property="og:title" content={ companyName } />
        <meta property="og:description" content="Dynamic page content" />
      </Helmet>

      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={ <Page /> } />
          <Route path="/:slug" element={ <Page /> } />
          <Route path={ `/${pageForPosts}` } element={ <Archive postType="post" /> } />
        </Routes>

      </BrowserRouter>
    </HelmetProvider>
  )
}
