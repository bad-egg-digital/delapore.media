import './Error.scss'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'

export default function Error(props) {
  const {
    code = "404",
    title = "Page Not Found",
    description = "Whoops! This path doesn't got anywhere.",
  } = props;

  return (
    <>
      <Helmet>
        <title>{ title }</title>
        <meta name="description" content={ description }/>

        <meta property="og:title" content={ title } />
        <meta property="og:description" content={ description } />
      </Helmet>

      <section className="section section-error">
        <div className="section section-zero-top container container-narrow align-centre">
          <h1>Error { code }</h1>
          <h2>{ title }</h2>
          <p>{ description }</p>
        </div>
      </section>

    </>

  )
}
