import './Embed.scss'
import parse from "html-react-parser"

export default function Audio({ rawContent }) {

  const Content = parse(rawContent)

  return (
    <>{ Content }</>
  )
}
