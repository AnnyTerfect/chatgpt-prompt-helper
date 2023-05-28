import React from 'react';
import PropTypes from 'prop-types';
import BaseButton from '../BaseButton';
import styles from './style.module.scss';

function ButtonContent({ type }) {
  switch (type) {
    case 'edit':
      return (
        <path
          className={styles.button}
          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        />
      );
    case 'finish':
      return <polyline className={styles.button} points="20 6 9 17 4 12" />;
    case 'delete':
      return (
        <g className={styles.button}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </g>
      );
    case 'up':
      return (
        <g className={styles.button}>
          <polyline points="18 15 12 9 6 15" />
        </g>
      );
    case 'down':
      return (
        <g className={styles.button}>
          <polyline points="6 9 12 15 18 9" />
        </g>
      );
    case 'top':
      return (
        <g className={styles.button}>
          <polyline points="18 15 12 9 6 15" />
          <polyline points="18 9 12 3 6 9" />
        </g>
      );
    case 'bottom':
      return (
        <g className={styles.button}>
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 15 12 21 18 15" />
        </g>
      );
    default:
      throw new Error('Unknown button type');
  }
}
ButtonContent.propTypes = {
  type: PropTypes.oneOf(['edit', 'finish', 'delete', 'up', 'down', 'top', 'bottom']).isRequired,
};

function TypeButton({ className, onClick, type }) {
  return (
    <BaseButton className={className} onClick={onClick}>
      <ButtonContent type={type} />
    </BaseButton>
  );
}
TypeButton.defaultProps = {
  className: '',
  onClick: () => {},
};
TypeButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['edit', 'finish', 'delete', 'up', 'down', 'top', 'bottom']).isRequired,
};

export default TypeButton;
