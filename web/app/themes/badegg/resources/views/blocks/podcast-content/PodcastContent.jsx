import './style.scss'
import parse from "html-react-parser"

export default function PodcastContent({ post }) {
  const { episodeContent } = post

  return (
    <div className="wp-block-badegg-podcast-content">
      <div className="wysiwyg">
        { parse(episodeContent) }
      </div>
    </div>
  )
}
