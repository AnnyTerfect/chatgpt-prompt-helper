import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

function BaseButton({ className, onClick, children }) {
  return (
    <svg
      className={`${styles.button} ${className}`}
      viewBox="0 0 24 24"
      onClick={onClick}
    >
      {children}
    </svg>
  );
}
BaseButton.defaultProps = {
  className: '',
  onClick: () => {},
};
BaseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default BaseButton;
