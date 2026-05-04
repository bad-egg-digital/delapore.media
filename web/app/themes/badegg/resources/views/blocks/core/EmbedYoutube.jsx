import parseYoutube from '@scripts/lib/parseYoutube'

export default function EmbedYoutube({ url })
{
  const youtubeID = parseYoutube(url)

  if(youtubeID) {
    const urlObject = new URL(url)
    const params = urlObject.searchParams
    const start = params.get('start')

    let embed = `https://www.youtube-nocookie.com/embed/${ youtubeID }`

    if(start) embed += `?start=${ start }`

    return (
      <iframe
        width="560"
        height="315"
        src={ embed }
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    )
  }
}
