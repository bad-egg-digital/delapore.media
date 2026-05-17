import Card from '@views/components/Card/Card'

export default function Posts( props ) {
  const {
    posts,
    postType = 'post',
    isLoaded,
    showLoading = false,
  } = props

  return (
    <div className={ `postgrid postgrid-${ postType } section section-small section-zero-bottom` }>
      { isLoaded && (
        <>
          { posts && posts.length > 0 && (
            <>

              { posts.map( ( post, index ) =>
                <Card
                  key={ `${ postType }-${ index }` }
                  postType={ postType }
                  isLoaded={ isLoaded }
                  { ...post.node }
                />
              )}

            </>

          )}
        </>
      )}

      { !isLoaded && showLoading && (
        <>
          { [...Array(3).keys()].map( x =>
            <Card
              key={ `loading-card-${ x }` }
              postType={ postType }
              isLoaded={ isLoaded }
              showLoading={ showLoading }
            />
          )}
        </>
      )}

    </div>
  )
}
