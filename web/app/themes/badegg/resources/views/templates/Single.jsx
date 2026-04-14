import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'

import BlockSwitchboard from '@blocks/Switchboard'
import Error from '@views/templates/Error'

export default function Single({ postType = 'page' }) {
  const { slug } = useParams()
  const [ post, setPost ] = useState(null)
  const [ isLoaded, setIsLoaded ] = useState(false)

  useEffect(() => {
    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          ${ postType }(id: "${ slug || '/' }", idType: URI) {
            id
            slug
            title
            blocks {
              name
              content
              attributes
              innerBlocks {
                attributes
                name
                content
                innerBlocks {
                  attributes
                  name
                  content
                  innerBlocks {
                    attributes
                    name
                    content
                    innerBlocks {
                      attributes
                      name
                      content
                      innerBlocks {
                        innerBlocks {
                          attributes
                          name
                          content
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
        setPost(res.data[postType])
        setIsLoaded(true)
      })
  }, [slug])

  if( isLoaded && post ) {
    return (
      <>
        <Helmet>
          <title>{ post.title }</title>
          <meta name="description" content="Dynamic page from WordPress" />

          <meta property="og:title" content={ post.title } />
          <meta property="og:description" content="Dynamic page content" />
        </Helmet>

        <>

          <h1>{ post.title }</h1>

          { !post ?
            `${ postType } not found ...`
          : null }

          { post?.blocks
            ? post.blocks.map((block, index) => <BlockSwitchboard key={index} { ...block } />)
            : null
          }

        </>
      </>

    )
  } else if (isLoaded) {
    return <Error />
  }
}
