import './App.scss'

import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
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
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: buildQuery() }),
    })
      .then(res => res.json())
      .then(res => {
        const pagesForArchives = res?.data?.badEggCup?.pagesForArchives

        setAppContext(prevState => ({
          ...prevState,
          company: res?.data?.badEggCup?.company,
          menuPrimaryData: res?.data?.menuItems?.nodes,
        }));

        if(pagesForArchives && pagesForArchives.length > 0){
          pagesForArchives.map((archive, index) => {

            let postType = archive.postType
            let page = archive.page

            setAppContext(prevState => ({
              ...prevState,
              pagesForArchives: {
                ...prevState?.pagesForArchives,
                [postType]: page,
              }
            }));

          })
        }

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
                  <Wrapper>
                    <Routes>
                      <Route path="/" element={ <Single key={ `route-page` } /> } />
                      <Route path="/:slug" element={ <Single key={ `route-page` } /> } />
                      <Route path={ `/category/:term` } element={ <Archive key={ `route-post` } postType="post" /> } />

                      { (appContext?.pagesForArchives) && (
                        <>

                          { Object.keys(appContext.pagesForArchives).map( postType => {
                            let archive = appContext.pagesForArchives[postType]
                            let path = `/${ archive.slug }`

                            return (
                              <React.Fragment key={ `routes-${postType}` }>
                                <Route  path={ path } element={
                                  <Archive
                                    key={ `route-${ postType }` }
                                    postType={ postType }
                                    pageForArchive={ archive }
                                  />
                                } />
                                <Route path={ `${ path }/:slug` } element={
                                  <Single
                                    key={ `route-${ postType }` }
                                    postType={ postType }
                                  />
                                } />
                              </React.Fragment>
                            )
                          })}

                        </>
                      )}

                    </Routes>
                  </Wrapper>
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

function buildQuery()
{
  let query = `
    {
      badEggCup {
        pagesForArchives {
          postType
          page {
            slug
            title
            content
            excerpt
            databaseId
            blocks {
              attributes
              content
              name
              rawContent
              innerBlocks {
                index
                name
                attributes
                content
                rawContent
              }
            }
          }
        }
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

  return query;
}
