import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import useStoreState from "../hooks/useStoreState";
import { newSolution } from "../services/axios";

export const MAX_GUESSES_NUMBER = 6;
export const WORD_LENGTH = 5;
enum colors {
  grey = "GREY", // wrong
  yellow = "YELLOW", // right but wrong order
  green = "GREEN", // right order
  white = "WHITE", // not used
}
export type coloredGuessType =
  | {
      letter: string;
      color: colors;
    }
  | undefined;

interface WordleContextInterface {
  guesses: string[];
  currentGuess: string;
  solution: string;
  coloredGuesses: coloredGuessType[][];
  guessNumber: number;
  usedLetters: coloredGuessType[];
  modal: string;
  submitWord: (word: string) => void;
  handleKeyUp: (p: any) => void;
  closeModal: () => void;
}
const defaultKeyboard = () =>
  "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((letter) => ({ letter, color: colors.white }));

export const useWordle = () => {
  const [currentGuess, setCurrentGuess] = useState("");
  const [solution, setSolution] = useStoreState<string>("", "solution", {
    restoreAsyncCb: async () => {
      const res = await newSolution();
      return res.data[0];
    },
  });

  const [guesses, setGuesses] = useStoreState<string[]>([], "guesses");
  const [guessNumber, setguessNumber] = useStoreState(0, "guessNumber");
  const [coloredGuesses, setColoredGuesses] = useStoreState<
    coloredGuessType[][]
  >([], "coloredGuesses");
  const [usedLetters, setUsedLetters] = useStoreState<coloredGuessType[]>(
    defaultKeyboard(),
    "usedLetters"
  ); // a: green, b: grey
  const [modal, setModal] = useStoreState("", "modal");

  const reset = useCallback(() => {
    newSolution().then((res) => {
      setSolution(res.data[0]);
    });
    setGuesses([]);
    setCurrentGuess("");
    setguessNumber(0);
    setColoredGuesses([]);
    setUsedLetters(defaultKeyboard());
  }, []);
  const notValid = () => {
    if (currentGuess.length !== solution.length) return true; // wrong length
    if (guesses.includes(currentGuess)) return true; // same guess as before
  };
  const submitWord = () => {
    if (notValid()) return;
    const newChanges = colorLetters();
    setCurrentGuess("");
    setGuesses((prev) => [...prev, currentGuess]);
    setKeyBoard(newChanges);
    setguessNumber((cur) => cur + 1);
    isEndOfGame();
  };

  const colorLetters = () => {
    // obarvit jednotliva pismenka
    const currentGuessArray = currentGuess.split("");
    const newChanges: coloredGuessType[] = [];
    const coloredGuess = currentGuessArray.map((letter, index) => {
      if (letter === solution[index]) {
        newChanges.push({ letter, color: colors.green });
        return { letter, color: colors.green };
      }
      if (solution.split("").includes(letter)) {
        newChanges.push({ letter, color: colors.yellow });
        return { letter, color: colors.yellow };
      }
      newChanges.push({ letter, color: colors.grey });
      return { letter, color: colors.grey };
    });
    setColoredGuesses((prev) => [...prev, coloredGuess]);
    return newChanges;
  };

  const setKeyBoard = (newChanges: coloredGuessType[]) => {
    setUsedLetters((prev) =>
      prev.map((previous) => {
        if (!previous) return undefined;
        const newLetter = newChanges.find(
          (change) => change?.letter === previous?.letter
        );
        if (!newLetter) return previous;
        if (newLetter?.color === "GREEN" || previous?.color === "GREEN")
          return { ...previous, color: colors.green };
        return { ...previous, color: newLetter.color };
      })
    );
  };

  const isEndOfGame = () => {
    if (currentGuess === solution) {
      console.log(currentGuess, solution);

      setModal("You win 🙂");
      return;
    }
    if (guessNumber === 5) {
      setModal(`You lost 😥, solution was "${solution}"`);
      return;
    }
  };
  const closeModal = () => {
    reset();
    setModal("");
  };
  const handleKeyUp = ({ key }: any) => {
    if (key === "Enter") {
      submitWord();
      return;
    }
    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }
    if (currentGuess.length > 4) return; // no other space

    setCurrentGuess((prev) => prev + key);
  };
  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [handleKeyUp]);
  useEffect(() => {
    const sol = localStorage.getItem("solution");
    if (sol) {
      setSolution(sol);
      return;
    }
  }, []);

  return {
    solution,
    guesses,
    currentGuess,
    coloredGuesses,
    guessNumber,
    usedLetters,
    modal,
    submitWord,
    handleKeyUp,
    closeModal,
  };
};