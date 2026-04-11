export function containerClassNames(attributes, extraClasses = [])
{

  let classNames = [
    'container',
  ];

  if('container_width' in attributes && !['', '0'].includes(attributes.container_width))
    classNames.push(`container-${attributes.container_width}`);

  if('alignment' in attributes)
    classNames.push(`align-${attributes.alignment}`);

  // combine arrays
  classNames = classNames.concat(extraClasses);

  return classNames;
}

export function sectionClassNames(attributes, defaultClasses = '', extraClasses = [])
{
  let classNames = [
    'section',
  ];

  if('padding_top'in attributes && !attributes.padding_top)
    classNames.push('section-zero-top');

  if('padding_bottom'in attributes && !attributes.padding_bottom)
    classNames.push('section-zero-bottom');

  if('background_hex' in attributes && attributes.background_hex) {
    let bg = `bg-${ attributes.background_colour }`;

    if(
      'background_tint' in attributes &&
      attributes.background_tint != 0 &&
      !['white', 'black'].includes(attributes.background_colour)
    ) {
      bg += `-${ attributes.background_tint }`;
    }

    classNames.push(bg);
  }

  if('sidebar' in attributes && attributes.sidebar) {
    classNames.push('has-sidebar');
  }

  if('background_image' in attributes && attributes.background_image != '0')
    classNames.push('has-bg-image');

  if('background_contrast' in attributes && attributes.background_contrast)
    classNames.push('knockout');

  // combine arrays
  classNames = classNames.concat(defaultClasses).concat(extraClasses);

  // remove duplicate items
  classNames = [ ...new Set(classNames) ];

  return classNames;
}
