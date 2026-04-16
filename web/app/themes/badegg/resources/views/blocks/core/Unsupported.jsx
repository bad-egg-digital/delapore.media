export default function Unsupported({ index, name }) {
  const warning = `unsupported-${name}-${index}`;
  return <div className={ warning } ></div>
}
