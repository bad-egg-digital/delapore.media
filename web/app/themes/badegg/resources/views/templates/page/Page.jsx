import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import BlockSwitchboard from '@blocks/Switchboard'

export default function DefaultPage({ isFrontPage }) {
  const { slug } = useParams()
  const [ page, setPage ] = useState(null)
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          page(id: "${ slug || '/' }", idType: URI) {
            id
            slug
            title
            blocks {
              name
              attributes
              innerBlocks {
                attributes
                name
                innerBlocks {
                  innerBlocks {
                    innerBlocks {
                      innerBlocks {
                        innerBlocks {
                          attributes
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ` }),
    })
      .then(res => res.json())
      .then(res => {
        setPage(res?.data?.page)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <p>Loading...</p>
  if (!page) return <p>Page not found</p>

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content="Dynamic page from WordPress" />

        <meta property="og:title" content={ page.title } />
        <meta property="og:description" content="Dynamic page content" />
      </Helmet>

      <h1>{page.title}</h1>

      { page?.blocks
        ? page.blocks.map((block, index) => <BlockSwitchboard key={index} { ...block } />)
        : null
      }
    </>

  )
}
