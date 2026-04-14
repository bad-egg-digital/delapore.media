import parse, { domToReact } from "html-react-parser";
import { Link } from 'react-router-dom'

export default function parseHtml(html) {
  const options = {
    replace: ({ name, attribs, children }) => {
      // Convert internal links to Next.js Link components.
      const isInternalLink =
        name === "a" && attribs["data-internal-link"] === "true";

      if (isInternalLink) {
        return (
          <Link to={ attribs?.href } { ...attribs }>{ domToReact(children, options) }</Link>
        );
      }
    },
  };

  return parse(html, options);
}
