import clsx from 'clsx';
import parseHtml from "@scripts/lib/parser";

export default function Heading( attributes ) {
  const {
    name,
    level,
    content,
    textAlign,
  } = attributes;

  let htmlAttributes = {
    className: clsx(
      textAlign && `align-${ textAlign }`,
      name && name.replace('/', '-'),
    ),
  }

  const H = `h${ level || 2 }`

  return (
    <H { ...htmlAttributes }>{ parseHtml(content) }</H>
  )
}
