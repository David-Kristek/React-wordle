import React from "react";
import {
  MAX_GUESSES_NUMBER,
  useWordle,
  WORD_LENGTH,
} from "../context/WordleContext";

export default function CurrentGuess() {
  const { currentGuess, coloredGuesses } = useWordle();
  return (
    <>
      {MAX_GUESSES_NUMBER - coloredGuesses.length > 0 && (
        <div className="row current">
          {/* written letters */}
          {currentGuess.split("").map((letter, index) => (
            <div className="filled" key={index}>
              {letter}
            </div>
          ))}
          {/* rest of fields to have always Max_length in row */}
          {WORD_LENGTH - currentGuess.length > 0 &&
            [...Array(WORD_LENGTH - currentGuess.length)].map(
              (currentGuess, index) => <div key={index}></div>
            )}
        </div>
      )}
    </>
  );
}
