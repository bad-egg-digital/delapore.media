import './Delibird.scss'
import delibird from '@images/delibird.png'
import delibirdMic from '@images/delibird-mic.png'

export default function Delibird({ variant }) {

  let image = "";

  switch (variant) {
    case 'podcast': image = delibirdMic; break;
    default:        image = delibird;    break;
  }

  return (
    <figure className="delibird delibird-sidebar">
      <img src={ image } width="202" height="246" />
    </figure>
  )
}
