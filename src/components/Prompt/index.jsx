import React, { memo, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.scss';
import TypeButton from '../Buttons/TypeButton';

const Prompt = memo(forwardRef((props, ref) => {
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
    onUp,
    onDown,
    onTop,
    onBottom,
  } = props;

  const [status, setStatus] = useState('');

  if (editing) {
    return (
      <div
        className={styles.promptEdit}
      >
        {status === 'edit' ? (
          /* Show edit container */
          <div ref={ref} className={styles.editContainer}>
            <input
              className={styles.input}
              type="text"
              value={act}
              onChange={onChangeAct}
            />
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              type="text"
              rows={8}
              value={prompt}
              onChange={onChangePrompt}
            />
          </div>
        ) : (
          /* Show act name */
          <p>{act}</p>
        )}

        <div className={styles.button}>
          {/* Move To Top button */}
          <TypeButton
            className={styles.svg}
            type="top"
            onClick={() => onTop()}
          />
          {/* Move Up button */}
          <TypeButton
            className={styles.svg}
            type="up"
            onClick={() => onUp()}
          />
          {/* Move Down button */}
          <TypeButton
            className={styles.svg}
            type="down"
            onClick={() => onDown()}
          />
          {/* Move To Bottom button */}
          <TypeButton
            className={styles.svg}
            type="bottom"
            onClick={() => onBottom()}
          />
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
}));

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
  onUp: () => {},
  onDown: () => {},
  onTop: () => {},
  onBottom: () => {},
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
  onUp: PropTypes.func,
  onDown: PropTypes.func,
  onTop: PropTypes.func,
  onBottom: PropTypes.func,
};

export default Prompt;
