import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { pinyin } from "pinyin-pro";
import TypeButton from "@/components/Buttons/TypeButton";
import Prompt from "@/components/Prompt";
import { loadPrompts, savePrompts } from "@/data";
import { PromptWithIdPinyin } from "@/types";

function Dialog() {
  const [prompts, setPrompts] = useState<PromptWithIdPinyin[]>(() =>
    loadPrompts(),
  );
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchPinyin, setSearchPinyin] = useState("");
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(-1);

  const filteredPromptsRef = useRef<PromptWithIdPinyin[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

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
    setSearch("");
    if (editing) {
      setEditing(false);
      setEditIndex(-1);
      savePrompts(prompts);
    } else {
      setEditing(true);
      setSelectedIndex(0);
    }
  }, [editing, prompts]);

  const enter = useCallback(
    (id: string) => {
      const textarea = document.querySelector("textarea");
      if (!textarea) {
        return;
      }

      const prompt = prompts.find((item) => item.id === id);
      if (!prompt) {
        return;
      }
      textarea.value = prompt.prompt;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      setShow(false);
      setSearch("");
      setSelectedIndex(0);
    },
    [prompts],
  );

  const handleClickDocument = useCallback(() => {
    if (!editing) {
      setShow(false);
    }
  }, [editing]);

  // Click event
  const handleClickPrompt = useCallback(
    (id: string) => {
      enter(id);
    },
    [enter],
  );

  const handleChangeAct = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const { value } = e.target;
      setPrompts((val) =>
        val.map((item) => {
          if (item.id === id) {
            return { ...item, act: value };
          }
          return item;
        }),
      );
    },
    [],
  );

  const handleChangePrompt = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
      const { value } = e.target;
      setPrompts((val) =>
        val.map((item) => {
          if (item.id === id) {
            return { ...item, prompt: value };
          }
          return item;
        }),
      );
    },
    [],
  );

  const handleClickDelete = useCallback((id: string) => {
    setEditIndex(-1);
    setPrompts((val) => val.filter((item) => item.id !== id));
  }, []);

  const handleClickAdd = useCallback(() => {
    setPrompts((val) => [
      ...val,
      {
        id: Math.random().toString(36),
        act: "",
        prompt: "",
        pinyin: "",
      },
    ]);
    setEditIndex(filteredPromptsRef.current.length);
    setSelectedIndex(filteredPromptsRef.current.length);
  }, []);

  const handleUp = useCallback((index: number) => {
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

  const handleDown = useCallback((index: number) => {
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

  const handleTop = useCallback((index: number) => {
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

  const handleBottom = useCallback((index: number) => {
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
    function handleKeyDown(e: KeyboardEvent) {
      // Auto input
      if (show && !editing && inputRef.current) {
        inputRef.current.focus();
      }

      // Toggle dialog
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        setShow((val) => !val);
      }
      if (e.key === "Escape") {
        setShow(false);
      }

      // Change selected index
      if (e.key === "ArrowUp") {
        if (e.ctrlKey || e.metaKey) {
          setSelectedIndex(0);
        } else {
          setSelectedIndex((val) => (val > 0 ? val - 1 : 0));
        }
      }
      if (e.key === "ArrowDown") {
        if (e.ctrlKey || e.metaKey) {
          setSelectedIndex(filteredPromptsRef.current.length - 1);
        } else {
          const { length } = filteredPromptsRef.current;
          setSelectedIndex((val) => (val < length - 1 ? val + 1 : length - 1));
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (show && !editing && inputRef.current) {
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
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "nearest",
        behavior: editing ? "smooth" : undefined,
      });
    }
  }, [selectedIndex, editIndex, show]);

  useEffect(() => {
    document.body.addEventListener("click", handleClickDocument);
    return () =>
      document.body.removeEventListener("click", handleClickDocument);
  }, [handleClickDocument]);

  if (show) {
    return (
      <>
        <div
          className={`fixed left-1/2 top-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-4 max-w-[600px] max-h-[400px] w-full h-full bg-gray-900 rounded-xl transition-all duration-600 text-white ${editing ? "max-w-[800px] max-h-[600px]" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center text-2xl">
            <div>
              Type your prompt here
              <span className="ml-3 text-sm text-gray-400">
                (Call me with Ctrl/Command + /)
              </span>
            </div>
            <TypeButton
              type={editing ? "finish" : "edit"}
              onClick={handleClickTopButton}
            />
          </div>

          <div>
            <input
              ref={inputRef}
              type="text"
              className="mt-5 w-full bg-transparent border-white rounded text-white focus:outline-none focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  enter(filteredPrompts[selectedIndex].id);
                }
              }}
            />
          </div>

          <div className="mt-4 w-full h-full bg-gray-800 rounded-xl overflow-y-scroll">
            {filteredPrompts.map((item, index) => (
              <Prompt
                key={item.id}
                ref={index === selectedIndex ? activeRef : null}
                editing={editing}
                act={item.act}
                prompt={item.prompt}
                selected={index === selectedIndex}
                onEnter={() => handleClickPrompt(item.id)}
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
                className={
                  "py-2 mb-2 text-xl text-center hover:bg-gray-700 cursor-pointer"
                }
                onClick={handleClickAdd}
                onMouseOver={() => setSelectedIndex(filteredPrompts.length)}
              >
                +
              </div>
            ) : null}
          </div>
        </div>
        {editing && (
          <div
            className="fixed left-0 top-0 w-full h-full bg-black opacity-50"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </>
    );
  }
}

export default Dialog;
