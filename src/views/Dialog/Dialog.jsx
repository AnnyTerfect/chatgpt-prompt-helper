import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { pinyin } from 'pinyin-pro';
import TypeButton from '../../components/Buttons/TypeButton';
import Prompt from '../../components/Prompt';
import { loadPrompts, savePrompts } from '../../data/index';
import styles from './Dialog.module.scss';

function Dialog() {
  const [prompts, setPrompts] = useState(() => loadPrompts());
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchPinyin, setSearchPinyin] = useState('');
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(-1);
  const [confirmIndex, setConfirmIndex] = useState(-1);

  const filteredPromptsRef = useRef([]);
  const inputRef = useRef(null);
  const activeRef = useRef(null);

  const filteredPrompts = useMemo(() => {
    const newFilteredPrompts = prompts.filter((item) => {
      if (!searchPinyin) {
        return true;
      }
      return item.pinyin.includes(searchPinyin) || item.act.includes(search);
    });
    filteredPromptsRef.current = newFilteredPrompts;
    return newFilteredPrompts;
  }, [search, searchPinyin, prompts]);

  function select(id) {
    const textarea = document.querySelector('textarea');
    textarea.value = prompts.find((item) => item.id === id).prompt;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
    setShow(false);
    setSearch('');
    setSelectedIndex(0);
  }
  function handleClickDocument() {
    if (!editing) {
      setShow(false);
    }
  }
  const handleClickTopButton = useCallback(() => {
    setSearch('');
    if (editing) {
      setEditing(false);
      setEditIndex(-1);
      savePrompts(prompts);
    } else {
      setEditing(true);
      setSelectedIndex(0);
    }
  }, [editing, prompts]);
  function handleClickPrompt(e, id) {
    e.preventDefault();
    e.stopPropagation();
    select(id);
  }
  function handleChangeAct(e, id) {
    const { value } = e.target;
    setPrompts((val) => val.map((item) => {
      if (item.id === id) {
        return { ...item, act: value };
      }
      return item;
    }));
  }
  function handleChangePrompt(e, id) {
    const { value } = e.target;
    setPrompts((val) => val.map((item) => {
      if (item.id === id) {
        return { ...item, prompt: value };
      }
      return item;
    }));
  }
  function handleClickDelete(id) {
    setEditIndex(-1);
    setConfirmIndex(-1);
    savePrompts(prompts.filter((item) => item.id !== id));
    setPrompts((val) => val.filter((item) => item.id !== id));
  }
  function handleClickAdd() {
    setPrompts((val) => [
      ...val,
      {
        id: Math.random().toString(36),
        act: '',
        prompt: '',
        pinyin: '',
      },
    ]);
    setEditIndex(prompts.length);
    setSelectedIndex(prompts.length);
  }

  useEffect(() => {
    if (show && !editing) {
      setSelectedIndex(0);
      inputRef.current.focus();
    }
    if (!show) {
      setEditing(false);
      setEditIndex(-1);
      setSelectedIndex(0);
      setSearch('');
      setSearchPinyin('');
    }
  }, [show]);
  useEffect(() => {
    setSelectedIndex(0);
    setEditIndex(-1);
    const pinyinArray = pinyin(search, { toneType: 'none', type: 'array' });
    const pinyinString = pinyinArray.join('').toLowerCase();
    setSearchPinyin(pinyinString);
  }, [search]);
  useEffect(() => {
    function handleKeyDown(e) {
      // Auto input
      if (show && !editing && inputRef.current) {
        inputRef.current.focus();
      }

      // Toggle dialog
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        setShow((val) => !val);
      }
      if (e.key === 'Escape') {
        setShow(false);
      }

      // Change selected index
      if (e.key === 'ArrowUp') {
        if (e.ctrlKey || e.metaKey) {
          setSelectedIndex(0);
        } else {
          setSelectedIndex((val) => (val > 0 ? val - 1 : 0));
        }
      }
      if (e.key === 'ArrowDown') {
        if (e.ctrlKey || e.metaKey) {
          setSelectedIndex(filteredPromptsRef.current.length - 1);
        } else {
          const { length } = filteredPromptsRef.current;
          setSelectedIndex((val) => (val < length - 1 ? val + 1 : length - 1));
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: 'nearest',
        behavior: editing ? 'smooth' : undefined,
      });
    }
  }, [selectedIndex, editIndex, show]);
  useEffect(() => {
    document.body.addEventListener('click', handleClickDocument);
    return () => document.body.removeEventListener('click', handleClickDocument);
  }, [handleClickDocument]);

  if (show) {
    return (
      <>
        <div
          className={`${styles.mainContainer} ${editing ? styles.editing : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.title}>
            <div>
              Type your prompt here
              <span className={styles.tips}>
                (Call me with Ctrl/Command + /)
              </span>
            </div>
            <TypeButton
              type={editing ? 'finish' : 'edit'}
              onClick={handleClickTopButton}
            />
          </div>

          <div>
            <input
              ref={inputRef}
              type="text"
              className={styles.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault();
                }
                if (e.key === 'Enter') {
                  e.preventDefault();
                  select(filteredPrompts[selectedIndex].id);
                }
              }}
            />
          </div>

          <div className={styles.promptContainer}>
            {filteredPrompts.map((item, index) => (
              <Prompt
                key={item.id}
                ref={index === selectedIndex ? activeRef : null}
                editing={editing}
                act={item.act}
                prompt={item.prompt}
                selected={index === selectedIndex}
                onEnter={(e) => handleClickPrompt(e, item.id)}
                onMouseOver={() => setSelectedIndex(index)}
                onChangePrompt={(e) => handleChangePrompt(e, item.id)}
                onChangeAct={(e) => handleChangeAct(e, item.id)}
                onDelete={() => handleClickDelete(item.id)}
              />
            ))}
            {editing ? (
              <div
                className={styles.addContainer}
                onClick={handleClickAdd}
                onMouseOver={() => setSelectedIndex(filteredPrompts.length)}
              >
                +
              </div>
            )
              : null}
          </div>
        </div>
        {editing && (
          <div className={styles.mask} onClick={(e) => e.stopPropagation()} />
        )}
      </>
    );
  }
}

export default Dialog;
