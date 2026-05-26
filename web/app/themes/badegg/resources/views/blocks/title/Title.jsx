import './style.scss'
import { useEffect, useState } from 'react'
import parse from "html-react-parser"
import Block from '@views/layouts/Block'
import Delibird from '@views/components/Delibird/Delibird';

export default function Title( props ) {
  const { post, postType, attributes } = props
  const { subtitle, hideDelibird } = attributes
  const { title, excerpt } = post

  return (
    <Block className="wp-block-badegg-title" attributes={ attributes }>
      <div className={ `wp-block-badegg-title-layout ${ (!hideDelibird) ? 'has-delibird' : null }` }>
        <div className="wp-block-badegg-title-text">
          <h1>{ title }</h1>
          { subtitle &&
            <p className="wp-block-badegg-title-subtitle">{ subtitle }</p>
          }

          { excerpt &&
            <div className="wp-block-badegg-title-excerpt">{ parse(excerpt) }</div>
          }
        </div>

        { !hideDelibird &&
          <div className="wp-block-badegg-title-image">
            <Delibird variant={ postType?.name } />
          </div>
        }
      </div>
    </Block>
  )
}
