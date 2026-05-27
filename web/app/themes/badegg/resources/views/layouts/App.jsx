import './App.scss'

import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'

import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { CSSTransition } from 'react-transition-group';

import { AppContext } from '@views/layouts/AppContext'
import BgTexture from '@views/components/BgTexture/BgTexture'
import MenuSide from '@views/components/MenuSide/MenuSide'
import Header from '@views/sections/Header/Header'
import Footer from '@views/sections/Footer/Footer'
import Archive from '@views/templates/Archive'
import Single from '@views/templates/Single'
import AudioTray from '@views/components/AudioTray/AudioTray'
import { queryApp } from '@scripts/lib/graphql-queries'
import Error from '@views/templates/Error'

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Allow certain navigations to preserve scroll
    if (location.state?.preserveScroll) return;

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
  const { pageLoaded } = appContext
  const [ isLoaded, setIsLoaded ] = useState(false)
  const nodeRef = useRef(null);

  const [ companyName, setCompanyName ] = useState({})
  const [ primaryMenu, setPrimaryMenu ] = useState({})
  const [ pageType, setPageType ] = useState({})

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryApp }),
    })
      .then(res => res.json())
      .then(res => {
        setAppContext(prevState => ({
          ...prevState,
          company: res?.data?.badEggCup?.company,
          menuPrimaryData: res?.data?.menuItems?.nodes,
          postTypes: res?.data?.contentTypes?.nodes,
          pageForPosts: res?.data?.readingSettings?.pageForPosts,
          pageLoaded: false,
        }));

        setPageType(res?.data?.contentType)
        setIsLoaded(true);
      })
      .catch( error => {
        console.error('Error fetching app data:', error)
        console.log(queryApp)
      })
  }, [])

  return (
    <HelmetProvider>
      { isLoaded ? (
        <>
          <Helmet>
            {/* <title>{ companyName }</title>
            <meta name="description" content="Dynamic page from WordPress" />

            <meta property="og:title" content={ companyName } />
            <meta property="og:description" content="Dynamic page content" /> */}
          </Helmet>

          <Router>
            <div className="wrapper">
              <main className="main">
                <Header />
                  <Wrapper>
                    <CSSTransition
                      nodeRef={ nodeRef }
                      in={ pageLoaded }
                      timeout={ 200 }
                      classNames="transitions-page"
                      // unmountOnExit={ true }
                    >
                      <div className="transitions-page" ref={ nodeRef }>
                        <Routes>
                          <Route path="/" element={ <Single key={ `route-page` } postType={ pageType } /> } />
                          <Route path="/:slug" element={ <Single key={ `route-page` } postType={ pageType } /> } />

                          { (appContext?.postTypes) && (
                            <>
                              { Object(appContext.postTypes).map( postType => {
                                if(postType?.name === 'page') {

                                }

                                if(postType?.uri) {
                                  let archive = postType?.pageForArchive
                                  let taxonomy = postType?.primaryTaxonomy

                                  return (
                                    <React.Fragment key={ `routes-${postType}` }>
                                      <Route path={ `${ postType.uri }:slug` } element={
                                        <Single key={ `route-${ postType }` } postType={ postType } />
                                      } />

                                      { archive && (
                                        <>
                                          <Route path={ `/${archive.slug}/` } element={
                                            <Archive key={ `route-${ postType }` } postType={ postType } pageID={ archive?.databaseId } taxonomy={ taxonomy } />
                                          } />
                                        </>
                                      ) }

                                      { taxonomy && (
                                        <>
                                          <Route path={ `${ taxonomy.uri }/:term` } element={
                                            <Archive key={ `route-${ postType }` } postType={ postType } pageID={ archive?.databaseId } taxonomy={ taxonomy } />
                                          } />
                                        </>
                                      ) }
                                    </React.Fragment>
                                  )
                                }
                              })}
                            </>
                          )}
                        </Routes>
                      </div>
                    </CSSTransition>
                  </Wrapper>
              </main>
              <Footer />
            </div>

            <MenuSide open={ appContext.menuOpen } items={ primaryMenu } />
            <AudioTray />

          </Router>
        </>
      ) : (
        <Error
          code="400"
          title="Connection Lost"
          description="Please reload when you find it."
        />
      )}

      <BgTexture className="global fixed" />
    </HelmetProvider>
  )
}

