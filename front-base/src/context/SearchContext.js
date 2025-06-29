//src/context/SearchContext.js
import { createContext } from "react";

export const SearchContext = createContext({
  searchTerm: "",
  setSearchTerm: () => {},
  searchTitle: "",
  setSearchTitle: () => {}
});