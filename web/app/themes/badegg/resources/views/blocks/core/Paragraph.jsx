import clsx from 'clsx';
import parseHtml from "@scripts/lib/parser";

export default function Paragraph( attributes ) {
  const { name, content, dropCap, align } = attributes;

	const className = clsx( {
		'has-drop-cap':
			align === 'right' ||
			align === 'center'
				? false
				: dropCap,
	} );

  // console.log(attributes);

	return (
    <p className={ className }>{ parseHtml(content) }</p>
	)
}
