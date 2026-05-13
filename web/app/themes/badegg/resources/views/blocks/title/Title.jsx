import './style.scss'
import { useEffect, useState } from 'react'
import parse from "html-react-parser"
import Block from '@views/layouts/Block'
import Delibird from '@views/components/Delibird/Delibird';

export default function Title( props ) {
  const { post, attributes } = props
  const { subtitle, enabledSubtitle, hideDelibird } = attributes
  const [ title, setTitle ] = useState('')
  const [ excerpt, setExcerpt ] = useState('')

  useEffect(() => {
    setTitle( post.title )
    setExcerpt( post.excerpt )
  }, [ post ])

  return (
    <Block className="wp-block-badegg-title" attributes={ attributes }>
      <div className={ `wp-block-badegg-title-layout ${ (!hideDelibird) ? 'has-delibird' : null }` }>
        <div className="wp-block-badegg-title-text">
          <h1>{ title }</h1>
          { enabledSubtitle && subtitle &&
            <p className="wp-block-badegg-title-subtitle">{ subtitle }</p>
          }

          { excerpt &&
            <div className="wp-block-badegg-title-excerpt">{ parse(excerpt) }</div>
          }
        </div>
        <div className="wp-block-badegg-title-image">
          <Delibird />
        </div>
      </div>
    </Block>
  )
}
