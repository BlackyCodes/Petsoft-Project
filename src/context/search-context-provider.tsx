"use client";

import React, { useState } from "react";
import { createContext } from "react";

type SearchContextProvider = {

  children: React.ReactNode;
};
type TSearchContext = {
    searchQuery: string;
    handleChangeSearchQuery: (newValue:string) => void;
    

};

export const SearchContext = createContext<TSearchContext | null>(null);
export default function SearchContextProvider({

  children,
}: SearchContextProvider) {
  //state

  const [searchQuery, setSearchQuery] = useState("");

 


  

  //deprived state

  //event handlers
  const handleChangeSearchQuery = (newValue:string) => {

    setSearchQuery(newValue);
  
  }


  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleChangeSearchQuery,

    
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
