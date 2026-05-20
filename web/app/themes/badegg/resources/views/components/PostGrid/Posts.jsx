import clsx from 'clsx'
import Card from '@views/components/Card/Card'

export default function Posts( props ) {
  const {
    posts,
    postType,
    isLoaded,
    showLoading = false,
  } = props

  const className = clsx(
    'section',
    'section-small',
    'section-zero-bottom',
    'postgrid',
    postType?.name && 'postgrid-' + postType?.name,
  )

  return (
    <div className={ className }>
      <div className="postgrid-items postgrid-fade">
        { posts && posts.length > 0 ? (
          <>

            { posts.map( ( post, index ) =>
              <Card
                key={ `${ postType?.name }-${ index }` }
                postType={ postType?.name }
                isLoaded={ isLoaded }
                { ...post }
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
                    postType={ postType?.name }
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
