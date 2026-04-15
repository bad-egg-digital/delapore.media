import './BlockList.scss'
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function BlockList({ blocks, wrapper = false }) {

  const Wrapper = (props) => {
    if(wrapper) {
      return <div className="badegg-block-list">{ props.children }</div>
    } else {
      return <>{ props.children }</>
    }
  }

  if(blocks) {
    return (
      <Wrapper>
        { blocks.map((block, index) => (
          <Switchboard  key={ index } { ...block } />
        )) }
      </Wrapper>
    )
  }
}
