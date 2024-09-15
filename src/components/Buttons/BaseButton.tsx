import * as React from "react";

function BaseButton(
  {
    className,
    onClick,
    children,
  }: {
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
  } = { className: "", children: null },
) {
  return (
    <svg
      className={`h-[1em] w-[1em] cursor-pointer ${className}`}
      viewBox="0 0 24 24"
      onClick={onClick}
    >
      {children}
    </svg>
  );
}

export default BaseButton;
