import './style.scss'
import { useEffect, useState } from 'react'
import parse from "html-react-parser"

export default function Excerpt( props ) {
  const { post, attributes } = props
  const [ excerpt, setExcerpt ] = useState('')

  useEffect(() => {
    setExcerpt( post.excerpt )
  }, [ post ])

  if(excerpt) {
    return <div className="wp-block-badegg-excerpt">{ parse(excerpt) }</div>
  }
}
