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
        <div className="flex select-none flex-row items-center justify-between px-4 py-2 hover:bg-gray-700">
          {status === "edit" ? (
            /* Show edit container */
            <div ref={ref} className="flex w-full flex-col">
              <input
                className="w-1/1 rounded border-white bg-transparent text-white focus:border-blue-500 focus:outline-none"
                type="text"
                value={act}
                onChange={onChangeAct}
              />
              <textarea
                className="mt-2 w-full rounded border-white bg-transparent text-white focus:border-blue-500 focus:outline-none"
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
              className="h-[1.2em] w-[1.2em] cursor-pointer"
              type="top"
              onClick={onTop}
            />
            {/* Move Up button */}
            <TypeButton
              className="h-[1.2em] w-[1.2em] cursor-pointer"
              type="up"
              onClick={onUp}
            />
            {/* Move Down button */}
            <TypeButton
              className="h-[1.2em] w-[1.2em] cursor-pointer"
              type="down"
              onClick={onDown}
            />
            {/* Move To Bottom button */}
            <TypeButton
              className="h-[1.2em] w-[1.2em] cursor-pointer"
              type="bottom"
              onClick={onBottom}
            />
            {/* Edit or finish button */}
            <TypeButton
              className="h-[1.2em] w-[1.2em] cursor-pointer"
              type={status === "edit" ? "finish" : "edit"}
              onClick={() => setStatus(status === "edit" ? "" : "edit")}
            />
            {/* Delete or confirm button */}
            <TypeButton
              className="h-[1.2em] w-[1.2em] cursor-pointer"
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
        className={`cursor-pointer select-none px-4 py-1 leading-8 ${
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
