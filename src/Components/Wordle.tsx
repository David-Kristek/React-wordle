import React, { useEffect, useRef } from "react";
import {
  MAX_GUESSES_NUMBER,
  useWordle,
  WORD_LENGTH,
} from "../context/WordleContext";
import ColoredGuesses from "./ColoredGuesses";
import CurrentGuess from "./CurrentGuess";
import Keypad from "./Keypad";
import RestOfTable from "./RestOfTable";

export default function Wordle() {
  const { solution, modal, closeModal } =
    useWordle();
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: any) => {
    if (!modalRef.current?.contains(event.target) && modal) {
      closeModal();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [modal]);

  if (!solution) return <div>Loading</div>;

  return (
    <div role="wordle">
      {modal && (
        <div className="modal" role="modal">
          <div ref={modalRef}>{modal}</div>
        </div>
      )}
      {/* all colored guesses rows */}
      <ColoredGuesses />
      {/* current guess  */}
      <CurrentGuess />
      {/* rest of rows and fields to have always full table of maximal guess number rows */}
      <RestOfTable />

      <Keypad />
    </div>
  );
}
