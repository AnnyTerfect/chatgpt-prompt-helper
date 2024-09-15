import { pinyin } from "pinyin-pro";
import defaultPrompts from "./defaultPrompts";
import { Prompt, PromptWithIdPinyin } from "../types";

function savePrompts(prompts: Prompt[]) {
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

function loadPrompts(): PromptWithIdPinyin[] {
  let prompts: Prompt[];
  const tryPrompts = localStorage.getItem("prompts") ?? "[]";
  try {
    prompts = JSON.parse(tryPrompts) as Prompt[];
    if (!Array.isArray(prompts)) {
      throw new Error();
    }
    if (prompts.some((item) => typeof item.act !== "string")) {
      throw new Error();
    }
  } catch {
    prompts = defaultPrompts;
    savePrompts(prompts);
  }

  return prompts.map((item) => {
    const pinyinArray = pinyin(item.act, { toneType: "none", type: "array" });
    const pinyinString = pinyinArray.join("").toLowerCase();
    return {
      ...item,
      id: Math.random().toString(36),
      pinyin: pinyinString,
    };
  });
}

function resetPrompts() {
  const prompts = defaultPrompts;
  savePrompts(prompts);
  return prompts;
}

export { loadPrompts, savePrompts, resetPrompts };
