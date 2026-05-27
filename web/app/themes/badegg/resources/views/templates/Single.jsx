import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CSSTransition } from 'react-transition-group';

import { querySingle } from '@scripts/lib/graphql-queries'
import BlockList from '@views/components/BlockList/BlockList'
import Error from '@views/templates/Error'

export default function Single({ postType }) {
  const nodeRef = useRef(null);
  const { slug } = useParams()
  const [ post, setPost ] = useState({})
  const [ isLoaded, setIsLoaded ] = useState(false)

  const query = querySingle({ slug: slug, postType: postType});

  useEffect(() => {
    setIsLoaded(false)

    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setPost(res?.data?.[postType?.name] || {})
        setIsLoaded(true)
      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [ slug, postType ])

  return (
    <>
      <Helmet>
        <title>{ post?.title }</title>
        <meta name="description" content="Dynamic page from WordPress" />

        <meta property="og:title" content={ post?.title } />
        <meta property="og:description" content="Dynamic page content" />
      </Helmet>

      <CSSTransition
        nodeRef={ nodeRef }
        in={ isLoaded }
        timeout={ 300 }
        classNames="transitions-page"
        // unmountOnExit={ true }
      >
        <div className="transitions-page" ref={ nodeRef }>
          <BlockList key={ post?.databaseId } id={ post?.databaseId } postType={ postType } post={ post } />
        </div>
      </CSSTransition>
    </>
  )
}

