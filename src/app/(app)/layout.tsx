
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";

import prisma from "@/lib/db";
import { checkAuth, getPetByUserId } from "@/lib/server-utils";


import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) 
{

  const session = await checkAuth()
  const pets = await getPetByUserId(session.user.id)



  return <>
  <BackgroundPattern/> 
  <div className=" flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen ">
  <AppHeader/>
  <SearchContextProvider>


  <PetContextProvider data={pets}>
  {children}

  </PetContextProvider>
  </SearchContextProvider>

  <AppFooter/>

  </div>

  <Toaster position="top-right"/>

  
  </>;
}
