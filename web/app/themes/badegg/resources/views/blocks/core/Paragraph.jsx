import clsx from 'clsx';
import parseHtml from "@scripts/lib/parser";

export default function Paragraph( attributes ) {
  const {
    name,
    content,
    dropCap,
    align,
    style,
  } = attributes;

  let htmlAttributes = {
    className: clsx(
      align && `align-${ align }`,
      name && name.replace('/', '-'),
      {
        'has-drop-cap': (dropCap && align !== 'right' && align !== 'center'),
      }
    ),
    style: style,
  }

	return (
    <p { ...htmlAttributes }>{ parseHtml(content) }</p>
	)
}
