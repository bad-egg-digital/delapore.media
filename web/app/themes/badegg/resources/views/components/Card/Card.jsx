import './Card.scss'
import CardPodcast from './CardPodcast'
import CardPost    from './CardPost'

export default function Card( props ) {
  const { postType } = props;

  switch (name) {
    case "podcast": return <CardPodcast { ...props } />
    default:        return <CardPost    { ...props } />
  }
}
