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

  const enter = useCallback((id) => {
    const textarea = document.querySelector('textarea');
    textarea.value = prompts.find((item) => item.id === id).prompt;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
    setShow(false);
    setSearch('');
    setSelectedIndex(0);
  }, [prompts]);

  const handleClickDocument = useCallback(() => {
    if (!editing) {
      setShow(false);
    }
  }, [editing]);

  const handleClickPrompt = useCallback((e, id) => {
    e.preventDefault();
    e.stopPropagation();
    enter(id);
  }, [enter]);

  const handleChangeAct = useCallback((e, id) => {
    const { value } = e.target;
    setPrompts((val) => val.map((item) => {
      if (item.id === id) {
        return { ...item, act: value };
      }
      return item;
    }));
  }, []);

  const handleChangePrompt = useCallback((e, id) => {
    const { value } = e.target;
    setPrompts((val) => val.map((item) => {
      if (item.id === id) {
        return { ...item, prompt: value };
      }
      return item;
    }));
  }, []);

  const handleClickDelete = useCallback((id) => {
    setEditIndex(-1);
    setPrompts((val) => val.filter((item) => item.id !== id));
  }, []);

  const handleClickAdd = useCallback(() => {
    setPrompts((val) => [
      ...val,
      {
        id: Math.random().toString(36),
        act: '',
        prompt: '',
        pinyin: '',
      },
    ]);
    setEditIndex(filteredPromptsRef.current.length);
    setSelectedIndex(filteredPromptsRef.current.length);
  }, []);

  const handleUp = useCallback((index) => {
    if (index === 0) {
      return;
    }
    setPrompts((val) => {
      const newPrompts = [...val];
      const temp = newPrompts[index - 1];
      newPrompts[index - 1] = newPrompts[index];
      newPrompts[index] = temp;
      return newPrompts;
    });
    setEditIndex(index - 1);
    setSelectedIndex(index - 1);
  }, []);

  const handleDown = useCallback((index) => {
    if (index === filteredPromptsRef.current.length - 1) {
      return;
    }
    setPrompts((val) => {
      const newPrompts = [...val];
      const temp = newPrompts[index + 1];
      newPrompts[index + 1] = newPrompts[index];
      newPrompts[index] = temp;
      return newPrompts;
    });
    setEditIndex(index + 1);
    setSelectedIndex(index + 1);
  }, []);

  const handleTop = useCallback((index) => {
    if (index === 0) {
      return;
    }
    setPrompts((val) => {
      const newPrompts = [...val];
      const temp = newPrompts[index];
      newPrompts.splice(index, 1);
      newPrompts.unshift(temp);
      return newPrompts;
    });
    setEditIndex(0);
    setSelectedIndex(0);
  }, []);

  const handleBottom = useCallback((index) => {
    if (index === filteredPromptsRef.current.length - 1) {
      return;
    }
    setPrompts((val) => {
      const newPrompts = [...val];
      const temp = newPrompts[index];
      newPrompts.splice(index, 1);
      newPrompts.push(temp);
      return newPrompts;
    });
    setEditIndex(filteredPromptsRef.current.length - 1);
    setSelectedIndex(filteredPromptsRef.current.length - 1);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      // Auto input
      if (show && !editing && inputRef.current) {
        inputRef.current.focus();
      }

      // Toggle dialog
      if (e.ctrlKey && e.key === '/') {
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
                  enter(filteredPrompts[selectedIndex].id);
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
                onUp={() => handleUp(index)}
                onDown={() => handleDown(index)}
                onTop={() => handleTop(index)}
                onBottom={() => handleBottom(index)}
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
