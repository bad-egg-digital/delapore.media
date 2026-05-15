import './App.scss'

import {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  Suspense,
} from 'react'

import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import { AppContext } from '@views/layouts/AppContext'
import BgTexture from '@views/components/BgTexture/BgTexture'
import MenuSide from '@views/components/MenuSide/MenuSide'
import Header from '@views/sections/Header/Header'
import Footer from '@views/sections/Footer/Footer'
import Archive from '@views/templates/Archive'
import Single from '@views/templates/Single'

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [ location.pathname ]);

  return children;
};

export default function App() {
  const { appContext, setAppContext } = useContext( AppContext )
  const [ isLoaded, setIsLoaded ] = useState(false)

  const [ companyName, setCompanyName ] = useState('Loading...')
  const [ pageForPosts, setPageForPosts ] = useState(0)
  const [ pageForPodcasts, setPageForPodcasts ] = useState(0)
  const [ primaryMenu, setPrimaryMenu ] = useState('Loading...')

  useEffect(() => {
    let query = `
      {
        badEgg {
          archiveObjects {
            post {
              slug
            }
            podcast {
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
    `

    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setPageForPosts(res?.data?.badEgg?.archiveObjects?.post?.slug);
        setPageForPodcasts(res?.data?.badEgg?.archiveObjects?.podcast?.slug);

        setAppContext(prevState => ({
          ...prevState,
          company: res?.data?.badEggCup?.company,
          menuPrimaryData: res?.data?.menuItems?.nodes,
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
          <Router>
            <div className="wrapper">
              <main className="main">
                <Header />
                <Suspense fallback={ <h2>LOADING</h2> }>
                  <Wrapper>
                    <Routes>
                      <Route path="/" element={ <Single /> } />
                      <Route path="/:slug" element={ <Single /> } />
                      <Route path={ `/${ pageForPodcasts }` } element={ <Archive postType="podcast" /> } />

                      <Route path={ `/${ pageForPosts }` } element={ <Archive postType="post" /> } />
                      <Route path={ `/category/:term` } element={ <Archive postType="post" /> } />

                      <Route path={ `/${ pageForPosts }/:slug` } element={ <Single postType="post" /> } />
                      <Route path={ `/${ pageForPodcasts }/:slug` } element={ <Single postType="podcast" /> } />

                    </Routes>
                  </Wrapper>
                </Suspense>
              </main>
              <Footer />
            </div>

            <MenuSide open={ appContext.menuOpen } items={ primaryMenu } />

          </Router>
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
