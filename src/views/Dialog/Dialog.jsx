import { useState, useEffect, useRef, useMemo } from "react";
import TypeButton from "/src/components/Buttons/TypeButton";
import { loadPrompts, savePrompts } from "/src/data/index";
import { pinyin } from "pinyin-pro";
import styles from "./Dialog.module.scss";

function Dialog() {
  const [prompts, setPrompts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchPinyin, setSearchPinyin] = useState("");
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(-1);
  const [confirmIndex, setConfirmIndex] = useState(-1);

  const filteredPromptsRef = useRef([]);
  const inputRef = useRef(null);
  const activeRef = useRef(null);

  const filteredPrompts = useMemo(() => {
    const _filteredPrompts = prompts.filter((item) => {
      if (!searchPinyin) {
        return true;
      } else {
        return item.pinyin.includes(searchPinyin) || item.act.includes(search);
      }
    });
    filteredPromptsRef.current = _filteredPrompts;
    return _filteredPrompts;
  }, [search, searchPinyin, prompts]);

  useEffect(() => {
    setPrompts(loadPrompts());
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
      setSearch("");
      setSearchPinyin("");
    }
  }, [show]);
  useEffect(() => {
    setSelectedIndex(0);
    setEditIndex(-1);
    const pinyinArray = pinyin(search, { toneType: "none", type: "array" });
    const pinyinString = pinyinArray.join("").toLowerCase();
    setSearchPinyin(pinyinString);
  }, [search]);
  useEffect(() => {
    function handleKeyDown(e) {
      // Auto input
      if (show && !editing) {
        inputRef.current && inputRef.current.focus();
      }

      // Toggle dialog
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        setShow((show) => !show);
      }
      if (e.key === "Escape") {
        setShow(false);
      }

      // Change selected index
      if (e.key === "ArrowUp") {
        if (e.ctrlKey || e.metaKey) {
          setSelectedIndex(0);
        } else {
          setSelectedIndex((selectedIndex) =>
            selectedIndex > 0 ? selectedIndex - 1 : 0
          );
        }
      }
      if (e.key === "ArrowDown") {
        if (e.ctrlKey || e.metaKey) {
          setSelectedIndex(filteredPromptsRef.current.length - 1);
        } else {
          const length = filteredPromptsRef.current.length;
          setSelectedIndex((selectedIndex) =>
            selectedIndex < length - 1 ? selectedIndex + 1 : length - 1
          );
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    activeRef.current &&
      activeRef.current.scrollIntoView({
        block: "nearest",
        behavior: editing ? "smooth" : undefined,
      });
  }, [selectedIndex, editIndex, show]);

  useEffect(() => {
    document.body.addEventListener("click", handleClickDocument);
    return () =>
      document.body.removeEventListener("click", handleClickDocument);
  }, []);

  function select(id) {
    const textarea = document.querySelector("textarea");
    textarea.value = prompts.find((item) => item.id === id).prompt;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
    setShow(false);
    setSearch("");
    setSelectedIndex(0);
  }
  function handleClickDocument(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    setShow(false);
  }
  function handleClickTopButton() {
    setSearch("");
    if (editing) {
      setEditing(false);
      setEditIndex(-1);
      savePrompts(prompts);
    } else {
      setEditing(true);
      setSelectedIndex(0);
    }
  }
  function handleClickPrompt(e, id) {
    e.preventDefault();
    e.stopPropagation();
    select(id);
  }
  function handleChangeAct(e, id) {
    const value = e.target.value;
    setPrompts((prompts) =>
      prompts.map((item) => {
        if (item.id === id) {
          return { ...item, act: value };
        } else {
          return item;
        }
      })
    );
  }
  function handleChangePrompt(e, id) {
    const value = e.target.value;
    setPrompts((prompts) =>
      prompts.map((item) => {
        if (item.id === id) {
          return { ...item, prompt: value };
        } else {
          return item;
        }
      })
    );
  }
  function handleClickDelete(index) {
    if (confirmIndex === index) {
      const id = prompts[index].id;
      setEditIndex(-1);
      setConfirmIndex(-1);
      savePrompts(prompts.filter((item) => item.id !== id));
      setPrompts((prompts) => prompts.filter((item) => item.id !== id));
    } else {
      setConfirmIndex(index);
    }
  }
  function handleClickAdd() {
    setPrompts((prompts) => [
      ...prompts,
      { id: Date.now(), act: "", prompt: "", pinyin: "" },
    ]);
    setEditIndex(prompts.length);
    setSelectedIndex(prompts.length);
  }

  if (show) {
    return (
      <>
        <div
          className={`${styles.mainContainer} ${editing ? styles.editing : ""}`}
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
              type={editing ? "finish" : "edit"}
              onClick={handleClickTopButton}
            />
          </div>

          <div className={styles.searchContainer}>
            <input
              ref={inputRef}
              type="text"
              className={styles.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  select(filteredPrompts[selectedIndex].id);
                }
              }}
            />
          </div>

          <div className={styles.promptContainer}>
            {editing ? (
              <>
                {filteredPrompts.map((item, index) => {
                  return (
                    <div key={index}>
                      <div
                        className={`${styles.promptEdit} ${
                          editIndex === index ? styles.active : ""
                        }`}
                      >
                        {editIndex === index ? (
                          /*Show edit container*/
                          <div
                            ref={(element) => {
                              if (index === editIndex) {
                                activeRef.current = element;
                              }
                            }}
                            className={styles.editContainer}
                          >
                            <input
                              className={styles.input}
                              type="text"
                              value={item.act}
                              onChange={(e) => handleChangeAct(e, item.id)}
                            />
                            <textarea
                              className={`${styles.input} ${styles.textarea}`}
                              type="text"
                              rows={8}
                              value={item.prompt}
                              onChange={(e) => handleChangePrompt(e, item.id)}
                            />
                          </div>
                        ) : (
                          /*Show act name*/
                          <h2>{item.act}</h2>
                        )}

                        <div className={styles.button}>
                          {/*Edit or finish button*/}
                          <TypeButton
                            className="w-1.2em h-1.2em ml-2"
                            type={editIndex === index ? "finish" : "edit"}
                            onClick={() =>
                              setEditIndex(editIndex === index ? -1 : index)
                            }
                          />
                          {/* Delete or confirm button */}
                          <TypeButton
                            className="w-1.2em h-1.2em ml-2"
                            type={confirmIndex === index ? "finish" : "delete"}
                            onClick={() => handleClickDelete(index)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.addContainer} onClick={handleClickAdd}>
                  +
                </div>
              </>
            ) : (
              filteredPrompts.map((item, index) => {
                return (
                  <div
                    ref={(element) => {
                      if (index === selectedIndex) {
                        activeRef.current = element;
                      }
                    }}
                    className={`cursor-pointer ${styles.prompt} ${
                      index === selectedIndex ? styles.active : ""
                    }`}
                    key={index}
                    onClick={(e) => show && handleClickPrompt(e, item.id)}
                    onMouseOver={() => show && setSelectedIndex(index)}
                  >
                    <h2>{item.act}</h2>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {editing && <div className={styles.mask} onClick={(e) => e.stopPropagation()}></div>}
      </>
    );
  } else {
    return;
  }
}

export default Dialog;
