import parseVimeo from '@scripts/lib/parseVimeo'

export default function EmbedVimeo({ url })
{
  const vimeoID = parseVimeo(url)

  if(vimeoID) {
    return (
      <iframe
        title="vimeo-player"
        src={ `https://player.vimeo.com/video/${ vimeoID }` }
        width="640"
        height="360"
        frameBorder="0"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      />
    )
  }
}
