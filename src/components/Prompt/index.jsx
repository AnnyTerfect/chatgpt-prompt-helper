import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.scss';
import TypeButton from '../Buttons/TypeButton';

const Prompt = forwardRef((props, ref) => {
  const {
    editing,
    selected,
    act,
    prompt,
    onEnter,
    onMouseOver,
    onChangePrompt,
    onChangeAct,
    onDelete,
  } = props;

  const [status, setStatus] = useState('');

  if (editing) {
    return (
      <div
        className={`${styles.promptEdit} ${selected ? styles.selected : ''}`}
      >
        {status === 'edit' ? (
          /* Show edit container */
          <div ref={ref} className={styles.editContainer}>
            <input
              className={styles.input}
              type="text"
              value={act}
              onChange={onChangePrompt}
            />
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              type="text"
              rows={8}
              value={prompt}
              onChange={onChangeAct}
            />
          </div>
        ) : (
          /* Show act name */
          <p>{act}</p>
        )}

        <div className={styles.button}>
          {/* Edit or finish button */}
          <TypeButton
            className={styles.svg}
            type={status === 'edit' ? 'finish' : 'edit'}
            onClick={() => setStatus(status === 'edit' ? '' : 'edit')}
          />
          {/* Delete or confirm button */}
          <TypeButton
            className={styles.svg}
            type={status === 'confirm' ? 'finish' : 'delete'}
            onClick={() => (status === 'confirm' ? onDelete() : setStatus('confirm'))}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={`cursor-pointer ${styles.prompt} ${
        selected ? styles.selected : ''
      }`}
      onClick={onEnter}
      onMouseOver={onMouseOver}
    >
      <p>{act}</p>
    </div>
  );
});

Prompt.defaultProps = {
  editing: false,
  selected: false,
  act: '',
  prompt: '',
  onEnter: () => {},
  onMouseOver: () => {},
  onChangePrompt: () => {},
  onChangeAct: () => {},
  onDelete: () => {},
};

Prompt.propTypes = {
  editing: PropTypes.bool,
  selected: PropTypes.bool,
  act: PropTypes.string,
  prompt: PropTypes.string,
  onEnter: PropTypes.func,
  onMouseOver: PropTypes.func,
  onChangePrompt: PropTypes.func,
  onChangeAct: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Prompt;
