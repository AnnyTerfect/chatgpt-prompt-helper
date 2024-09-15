import React, { memo, forwardRef, useState } from "react";
import { TypeButton } from "@/components/Buttons";

const Prompt = memo(
  forwardRef(function (
    {
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
    }: {
      editing: boolean;
      selected: boolean;
      act: string;
      prompt: string;
      onEnter?: () => void;
      onMouseOver?: () => void;
      onChangePrompt?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onChangeAct?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onDelete?: () => void;
      onUp?: () => void;
      onDown?: () => void;
      onTop?: () => void;
      onBottom?: () => void;
    } = {
      editing: false,
      selected: false,
      act: "",
      prompt: "",
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const [status, setStatus] = useState("");

    if (editing) {
      return (
        <div className="px-4 py-2 hover:bg-gray-700 flex flex-row justify-between items-center select-none">
          {status === "edit" ? (
            /* Show edit container */
            <div ref={ref} className="w-full flex flex-col">
              <input
                className="w-1/1 bg-transparent border-white rounded text-white focus:outline-none focus:border-blue-500"
                type="text"
                value={act}
                onChange={onChangeAct}
              />
              <textarea
                className="mt-2 w-full bg-transparent border-white rounded text-white focus:outline-none focus:border-blue-500"
                rows={8}
                value={prompt}
                onChange={onChangePrompt}
              />
            </div>
          ) : (
            /* Show act name */
            <p>{act}</p>
          )}

          <div className="flex flex-row space-x-2">
            {/* Move To Top button */}
            <TypeButton
              className="w-[1.2em] h-[1.2em] cursor-pointer"
              type="top"
              onClick={onTop}
            />
            {/* Move Up button */}
            <TypeButton
              className="w-[1.2em] h-[1.2em] cursor-pointer"
              type="up"
              onClick={onUp}
            />
            {/* Move Down button */}
            <TypeButton
              className="w-[1.2em] h-[1.2em] cursor-pointer"
              type="down"
              onClick={onDown}
            />
            {/* Move To Bottom button */}
            <TypeButton
              className="w-[1.2em] h-[1.2em] cursor-pointer"
              type="bottom"
              onClick={onBottom}
            />
            {/* Edit or finish button */}
            <TypeButton
              className="w-[1.2em] h-[1.2em] cursor-pointer"
              type={status === "edit" ? "finish" : "edit"}
              onClick={() => setStatus(status === "edit" ? "" : "edit")}
            />
            {/* Delete or confirm button */}
            <TypeButton
              className="w-[1.2em] h-[1.2em] cursor-pointer"
              type={status === "confirm" ? "finish" : "delete"}
              onClick={
                status === "confirm" ? onDelete : () => setStatus("confirm")
              }
            />
          </div>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={`cursor-pointer px-4 py-1 select-none leading-8 ${
          selected ? "bg-gray-700" : ""
        }`}
        onClick={onEnter}
        onMouseOver={onMouseOver}
      >
        <p>{act}</p>
      </div>
    );
  }),
);

export default Prompt;
