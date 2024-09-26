"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";

import  { useState,useOptimistic, use, act } from "react";
import { createContext } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};
type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet['id'] | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckOutPet: (id: Pet['id']) => Promise<void>;
  handleAddPet: (newPet:PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet['id'], newPetData: PetEssentials) => Promise<void>;

};

export const PetContext = createContext<TPetContext | null>(null);
export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {

const [optimisticPets,setOptimisticPets] =   useOptimistic(data, (state, {action,payload}) => {
  switch(action) {
    case "add":
      return [...state, {...payload, id: Math.random().toString()}]
    case "edit":
      return state.map((pet) => pet.id === payload.id ? {...pet, ...payload.newPetData} : pet)
    case "delete":
      return state.filter((pet) => pet.id !== payload)
    default:
      return state
  }

} )
  //state
 
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //deprived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);

  const numberOfPets = optimisticPets.length;

  //event handlers
  const handleAddPet =  async (newPet: PetEssentials) => {
    setOptimisticPets({action: "add",payload: newPet});
    const error =   await addPet(newPet)
        if(error) {
          toast.warning(error.message)
          return
        }
  };

  const handleEditPet  = async (petId: Pet['id'], newPetData: PetEssentials) => {
    setOptimisticPets({action: "edit",payload: {id: petId, newPetData}})

    const error = await editPet(petId,newPetData)
    if(error) {
      toast.warning(error.message)
      return
    }


  }

  const handleCheckOutPet =  async (petId: Pet['id']) => {
    setOptimisticPets({action: "delete",payload: petId})
    
    const error =   await deletePet(petId)
    if(error) {
      toast.warning(error.message)
      return
    }
    


    
    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (id: Pet['id']) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckOutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
