export interface Prompt {
  act: string;
  prompt: string;
}

export interface PromptWithIdPinyin extends Prompt {
  id: string;
  pinyin: string;
}
