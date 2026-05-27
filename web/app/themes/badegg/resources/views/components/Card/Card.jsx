import './Card.scss'
import CardLoading from './CardLoading'
import CardPodcast from './CardPodcast'
import CardProduct from './CardProduct'
import CardPost    from './CardPost'

export default function Card( props ) {
  const { postType, showLoading = false } = props

  if(showLoading) {
    return <CardLoading />
  } else {
    switch ( postType ) {
      case "podcast":   return <CardPodcast { ...props } />
      case "product":   return <CardProduct { ...props } />
      default:          return <CardPost    { ...props } />
    }
  }
}
