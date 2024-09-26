"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

import { usePetContext } from "@/lib/hooks";

import PetFormBtn from "./pet-form-btn";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE_URL } from "@/lib/constants";
import { TPetForm, petFormSchema } from "@/lib/validations";



type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};




export default function PetForm({
  actionType,
  onFormSubmission
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,

    formState: { errors },
  } = useForm<TPetForm>(
    {
      resolver: zodResolver(petFormSchema),
      defaultValues: actionType === 'edit' ? {
        name: selectedPet?.name,
        ownerName: selectedPet?.ownerName,
        imageUrl: selectedPet?.imageUrl,
        age: selectedPet?.age,
        notes: selectedPet?.notes,
        
      }: undefined

     
      }

    



  );

  return (
    <form
      className="flex flex-col"
      action={async () => {
        const result = await trigger();
        if (!result) return;
        

        onFormSubmission();
        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE_URL;


        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName"> Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age"> Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} {...register("notes")}></Textarea>
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
}
