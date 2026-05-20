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
  const [ primaryMenu, setPrimaryMenu ] = useState('Loading...')
  const [ pageType, setPageType ] = useState(null)

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: buildQuery() }),
    })
      .then(res => res.json())
      .then(res => {
        setAppContext(prevState => ({
          ...prevState,
          company: res?.data?.badEggCup?.company,
          menuPrimaryData: res?.data?.menuItems?.nodes,
          postTypes: res?.data?.contentTypes?.nodes,
        }));

        setPageType(res?.data?.contentType)
        setIsLoaded(true);
      })
  }, [])

  return (
    <HelmetProvider>
      { isLoaded && (
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
                                        <Archive key={ `route-${ postType }` } postType={ postType } archivePage={ archive } taxonomy={ taxonomy } />
                                      } />
                                    </>
                                  ) }

                                  { taxonomy && (
                                    <>
                                      <Route path={ `${ taxonomy.uri }/:term` } element={
                                        <Archive key={ `route-${ postType }` } postType={ postType } archivePage={ archive } taxonomy={ taxonomy } />
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
                  </Wrapper>
              </main>
              <Footer />
            </div>

            <MenuSide open={ appContext.menuOpen } items={ primaryMenu } />

          </Router>
          </>
        )}

      <BgTexture className="global fixed" />
    </HelmetProvider>
  )
}

function buildQuery()
{
  let query = `
    {
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
      contentType(id: "page", idType: NAME) {
        name
        graphqlPluralName
        graphqlSingleName
      }
      contentTypes {
        nodes {
          name
          label
          uri
          graphqlSingleName
          graphqlPluralName
          pageForArchive {
            slug
            title
            content
            excerpt
            databaseId
            uri
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
          primaryTaxonomy {
            name
            label
            uri
            graphqlSingleName
            graphqlPluralName
            connectedTerms {
              nodes {
                count
                name
                slug
                uri
              }
            }
          }
        }
      }
    }
  `

  return query;
}
