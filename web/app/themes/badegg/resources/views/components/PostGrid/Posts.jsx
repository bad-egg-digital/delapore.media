import clsx from 'clsx'
import Card from '@views/components/Card/Card'

export default function Posts( props ) {

  const {
    posts,
    postType = 'post',
    isLoaded,
    showLoading = false,
  } = props

  const className = clsx(
    'section',
    'section-small',
    'section-zero-bottom',
    'postgrid',
    postType && 'postgrid-' + postType,
  )

  return (
    <div className={ className }>
      <div className="postgrid-items postgrid-fade">
        { posts && posts.length > 0 ? (
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

        ) : (
          <>
            { showLoading &&
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
            }
          </>
        )}

      </div>
    </div>
  )
}
