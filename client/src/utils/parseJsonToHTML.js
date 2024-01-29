import { generateHTML } from "@tiptap/html";
import parse from "html-react-parser";
import { extensions } from "../constants/tipTapExtension";

export const parseJsonToHTML = (json) => {
  return parse(generateHTML(json, extensions));
};
