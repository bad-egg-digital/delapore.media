import './Card.scss'
import CardLoading from './CardLoading'
import CardPodcast from './CardPodcast'
import CardPost    from './CardPost'

export default function Card( props ) {
  const { postType, showLoading = false } = props

  // console.log(props)

  if(showLoading) {
    return <CardLoading />
  } else {
    switch ( postType ) {
      // case "podcast":   return <CardPodcast { ...props } />
      default:          return <CardPost    { ...props } />
    }
  }
}
