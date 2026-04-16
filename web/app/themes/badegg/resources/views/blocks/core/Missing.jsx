export default function Missing({ index, name }) {
  const warning = `missing-${name}-${index}`;
  return <div className={ warning } ></div>
}
