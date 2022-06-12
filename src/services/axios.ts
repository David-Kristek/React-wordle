import axios from "axios";
import { WORD_LENGTH } from "../context/WordleContext";

export const newSolution = () => {
  return axios.get(
    `https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}`
  );
};
