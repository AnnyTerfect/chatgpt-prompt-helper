import BaseButton from '../BaseButton'
import styles from './style.module.scss'

function TypeButton(props) {
  function getTypeButton(type) {
    if (type === 'edit') {
      return (
        <path
          className={styles.button}
          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        ></path>
      )
    }
    if (type === 'finish') {
      return (
        <polyline
          className={styles.button}
          points="20 6 9 17 4 12"
        ></polyline>
      )
    }
    if (type === 'delete') {
      return (
        <g className={styles.button}>
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </g>
      )
    }
    throw new Error('Unknown button type')
  }
  return (
    <BaseButton className={props.className} onClick={props.onClick}>
      {getTypeButton(props.type)}
    </BaseButton>
  )
}

export default TypeButton