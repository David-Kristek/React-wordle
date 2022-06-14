import React, { useEffect, useRef } from "react";
import { useWordle } from "../hooks/useWordle";
import ColoredGuesses from "./ColoredGuesses";
import CurrentGuess from "./CurrentGuess";
import Keypad from "./Keypad";
import RestOfTable from "./RestOfTable";

export default function Wordle() {
  const { solution, modal, closeModal, coloredGuesses, currentGuess } = useWordle();
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
      <ColoredGuesses coloredGuesses={coloredGuesses} />
      {/* current guess  */}
      <CurrentGuess currentGuess={currentGuess} coloredGuesses={coloredGuesses}/>
      {/* rest of rows and fields to have always full table of maximal guess number rows */}
      <RestOfTable coloredGuesses={coloredGuesses} />

      <Keypad />
    </div>
  );
}
