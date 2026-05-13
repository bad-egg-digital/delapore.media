import './Image.scss'
import parse, { attributesToProps } from "html-react-parser"

export default function Image({ rawContent }) {

  return parse( rawContent )

}
