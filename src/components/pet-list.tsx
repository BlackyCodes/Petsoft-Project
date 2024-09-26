'use client'
import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function PetList({}) {
  const {pets,handleChangeSelectedPetId,selectedPetId} = usePetContext()
  const {searchQuery} = useSearchContext()

  const filteredPets = React.useMemo(() => {
    return pets.filter((pet) => {
      return pet.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [pets, searchQuery]);


  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((pet) => {
        return (
          <li key={pet.id}>
            <button
            onClick={() => {
             handleChangeSelectedPetId(pet.id);
            }}
            
            className={ cn("flex h-[70px] w-full items-center px-5 text-base gap-3 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition", {
              "bg-[#eff1f2]": selectedPetId === pet.id,
            
            })}>
              <Image
                src={pet.imageUrl}
                alt={pet.name}
                width={45}
                height={45}
                className="rounded-full object-cover w-[45px] h-[45px]"
              />
              <p className="font-semibold">{pet.name}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
