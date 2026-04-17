export default function parseVimeo( url )
{
  if(!url) return 0;

  const urlObject = new URL(url);

  if(urlObject && urlObject.host == 'vimeo.com' && 'pathname' in urlObject){
    let vimeoID = urlObject.pathname.replace(/^\/+/, "");

    if('hash' in urlObject) {
      vimeoID += urlObject.hash;
    }

    return vimeoID;

  } else {
    return 0;

  }
}
