import './DropCap.scss'
import parse from "html-react-parser"

export default function DropCap( props ) {
  const { rawContent, textOverride } = props

  if(textOverride) {
    return <p className="has-drop-cap">{ parse(textOverride) }</p>
  } else {
    return <>{ parse(rawContent) }</>
  }
}
