import './DropCap.scss'
import parse from "html-react-parser"
import parseHtml from "@scripts/lib/parser"
import { useEffect, useState } from 'react'

export default function DropCap( props ) {
  const { content, rawContent, textOverride } = props
  const [ text, setText ] = useState('')

  useEffect(() => {
    if(textOverride) {
      const parsed = parseHtml(textOverride)

      if(parsed.length > 0) {
        setText( parsed[0].props.children )
      }
    }
  }, [ textOverride ])

  if(textOverride) {
    return <p className="has-drop-cap">{ text }</p>
  } else {
    return <>{ parse(rawContent) }</>
  }
}
