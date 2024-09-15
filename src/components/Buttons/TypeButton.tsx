import React from "react";
import BaseButton from "./BaseButton";

function ButtonContent(
  {
    type,
  }: {
    type: "edit" | "finish" | "delete" | "up" | "down" | "top" | "bottom";
  } = { type: "edit" },
) {
  switch (type) {
    case "edit":
      return (
        <path
          className="stroke-2 stroke-white fill-none"
          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        />
      );
    case "finish":
      return (
        <polyline
          className="stroke-2 stroke-white fill-none"
          points="20 6 9 17 4 12"
        />
      );
    case "delete":
      return (
        <g className="stroke-2 stroke-white fill-none">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </g>
      );
    case "up":
      return (
        <g className="stroke-2 stroke-white fill-none">
          <polyline points="18 15 12 9 6 15" />
        </g>
      );
    case "down":
      return (
        <g className="stroke-2 stroke-white fill-none">
          <polyline points="6 9 12 15 18 9" />
        </g>
      );
    case "top":
      return (
        <g className="stroke-2 stroke-white fill-none">
          <polyline points="18 15 12 9 6 15" />
          <polyline points="18 9 12 3 6 9" />
        </g>
      );
    case "bottom":
      return (
        <g className="stroke-2 stroke-white fill-none">
          <polyline points="6 9 12 15 18 9" />
          <polyline points="6 15 12 21 18 15" />
        </g>
      );
    default:
      throw new Error("Unknown button type");
  }
}

function TypeButton(
  {
    className,
    onClick,
    type,
  }: {
    className?: string;
    onClick?: () => void;
    type: "edit" | "finish" | "delete" | "up" | "down" | "top" | "bottom";
  } = { className: "", type: "edit" },
) {
  return (
    <BaseButton className={className} onClick={onClick}>
      <ButtonContent type={type} />
    </BaseButton>
  );
}

export default TypeButton;
