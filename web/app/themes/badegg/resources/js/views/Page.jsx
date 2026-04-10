import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Page() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetch(`/wp-json/wp/v2/pages?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setPage(data?.[0] || null)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <p>Loading...</p>
  if (!page) return <p>Page not found</p>

  return (
    <>
      <Helmet>
        <title>{page.title.rendered}</title>
        <meta name="description" content="Dynamic page from WordPress" />

        <meta property="og:title" content={page.title.rendered} />
        <meta property="og:description" content="Dynamic page content" />
      </Helmet>

      <h1>{page.title.rendered}</h1>

      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </>

  )
}
