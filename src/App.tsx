import React, { useEffect } from "react";
import Dialog from "@/components/Dialog";

function App() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const textarea = document.querySelector("textarea");
      if (
        textarea &&
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        event.target !== textarea
      ) {
        event.preventDefault();
        textarea.focus();
      }
    }

    window.addEventListener("keypress", handleKeyDown);
    return () => {
      window.removeEventListener("keypress", handleKeyDown);
    };
  }, []);

  return <Dialog />;
}

export default App;
