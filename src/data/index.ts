import { pinyin } from "pinyin-pro";
import defaultPrompts from "./defaultPrompts";
import { Prompt } from "../types";

function savePrompts(prompts: Prompt[]) {
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

function loadPrompts() {
  let prompts;
  const tryPrompts = localStorage.getItem("prompts") || "[]";
  try {
    prompts = JSON.parse(tryPrompts);
    if (!Array.isArray(prompts)) {
      throw new Error();
    }
  } catch {
    prompts = defaultPrompts;
    savePrompts(prompts);
  }

  prompts = prompts.map((item) => {
    const pinyinArray = pinyin(item.act, { toneType: "none", type: "array" });
    const pinyinString = pinyinArray.join("").toLowerCase();
    return {
      ...item,
      id: Math.random().toString(36),
      pinyin: pinyinString,
    };
  });
  return prompts;
}

function resetPrompts() {
  const prompts = defaultPrompts;
  savePrompts(prompts);
  return prompts;
}

export { loadPrompts, savePrompts, resetPrompts };
