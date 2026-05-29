import './style.scss'
import Block from '@views/layouts/Block'
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function ContactMethods( props ) {
  const { post, postType, attributes, innerBlocks } = props

  return (
    <Block className="wp-block-badegg-contact-methods" attributes={ attributes }>
      <div className="contact-method-inner">
        <div className="contact-method-cards">
          { Array.isArray(innerBlocks) && innerBlocks.length > 0 &&
            innerBlocks.map((block, index) => (
              <Switchboard key={ index } index={ index } post={ post } postType={ postType } {...block} />
            )
          )}
        </div>
      </div>
    </Block>
  )
}
