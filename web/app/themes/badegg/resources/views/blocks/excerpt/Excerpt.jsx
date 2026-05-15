import './style.scss'
import { useEffect, useState } from 'react'
import parse from "html-react-parser"
import DropCap from "@blocks/core/DropCap"

export default function Excerpt( props ) {
  const { post, attributes } = props
  const [ excerpt, setExcerpt ] = useState('')

  useEffect(() => {
    setExcerpt( post.excerpt )
  }, [ post ])

  if(excerpt) {
    return (
      <div className="wp-block-badegg-excerpt">
        { attributes?.dropCap ?
          <DropCap { ...props } textOverride={ excerpt } />
        :
          <>{ parse(excerpt) }</>
        }
      </div>
    )
  }
}
