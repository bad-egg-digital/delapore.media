import './App.scss'
import { Helmet } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect, useState } from 'react'

import BgTexture from '@views/components/BgTexture/BgTexture'
import Header from '@views/sections/header/Header'
import Archive from '@views/templates/Archive'
import Single from '@views/templates/Single'

export default function App() {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ companyName, setCompanyName ] = useState('Loading...')
  const [ pageForPosts, setPageForPosts ] = useState('Loading...')
  const [ primaryMenu, setPrimaryMenu ] = useState('Loading...')

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
          menuItems(where: { location: PRIMARY_NAVIGATION }) {
            nodes {
              label
              path
            }
          }
        }
      ` }),
    })
      .then(res => res.json())
      .then(res => {
        setPageForPosts(res.data.badEgg.archiveObjects.post.slug);
        setCompanyName(res.data.badEggCup.company.name)
        setPrimaryMenu(res.data.menuItems.nodes)
        setIsLoaded(true);
      })
  }, [])

  return (
    <HelmetProvider>
      <div className="wrapper">
        { isLoaded ? (
          <>
            <Helmet>
              {/* <title>{ companyName }</title>
              <meta name="description" content="Dynamic page from WordPress" />

              <meta property="og:title" content={ companyName } />
              <meta property="og:description" content="Dynamic page content" /> */}
            </Helmet>

            <BrowserRouter>
              <Header items={ primaryMenu } companyName={ companyName } />

              <Routes>
                <Route path="/" element={ <Single postType="page" /> } />
                <Route path="/:slug" element={ <Single postType="page" /> } />
                <Route path={ `/${pageForPosts}` } element={ <Archive postType="post" /> } />
                <Route path={ `/${pageForPosts}/:slug` } element={ <Single postType="post" /> } />
              </Routes>

            </BrowserRouter>
          </>
        ) : null }
      </div>
      <BgTexture className="global fixed" />
    </HelmetProvider>
  )

  // if else {
  //   return (
  //     <div>
  //       <h1>Loading...</h1>
  //     </div>
  //   )
  // }

}
