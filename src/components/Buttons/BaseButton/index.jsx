import styles from './style.module.scss'

function BaseButton(props) {
  return (
    <svg
      className={`${styles.button} ${props.className}`}
      viewBox="0 0 24 24"
      onClick={props.onClick}
    >
      {props.children}
    </svg>
  )
}

export default BaseButton;