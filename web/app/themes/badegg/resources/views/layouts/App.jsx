import './App.scss'
import { Helmet } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect, useState, useContext } from 'react'

import { AppContext } from '@views/layouts/AppContext'
import BgTexture from '@views/components/BgTexture/BgTexture'
import MenuSide from '@views/components/MenuSide/MenuSide'
import Header from '@views/sections/Header/Header'
import Footer from '@views/sections/Footer/Footer'
import Archive from '@views/templates/Archive'
import Single from '@views/templates/Single'

export default function App() {
  const { appContext, setAppContext } = useContext( AppContext )
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
              nameLegal
              socials {
                icon
                link
                svg
              }
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

        setAppContext(prevState => ({
          ...prevState,
          company: res.data.badEggCup.company,
          menuPrimaryData: res.data.menuItems.nodes,
        }));

        setIsLoaded(true);
      })
  }, [])

  return (
    <HelmetProvider>
      { isLoaded && (
        <Helmet>
          {/* <title>{ companyName }</title>
          <meta name="description" content="Dynamic page from WordPress" />

          <meta property="og:title" content={ companyName } />
          <meta property="og:description" content="Dynamic page content" /> */}
        </Helmet>
      )}

        { isLoaded && (
          <BrowserRouter>
            <div className="wrapper">
              <Header />
              <main className="main">
                <Routes>
                  <Route path="/" element={ <Single postType="page" /> } />
                  <Route path="/:slug" element={ <Single postType="page" /> } />
                  <Route path={ `/${pageForPosts}` } element={ <Archive postType="post" /> } />
                  <Route path={ `/${pageForPosts}/:slug` } element={ <Single postType="post" /> } />
                </Routes>
              </main>
              <Footer />
            </div>

            <MenuSide open={ appContext.menuOpen } items={ primaryMenu } />

          </BrowserRouter>
        )}

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
