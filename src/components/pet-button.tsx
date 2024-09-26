'use client'
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";
type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  

};

export default function PetButton({ actionType, children,onClick,disabled }: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);





  if (actionType === "checkout") {
    return <Button variant={"secondary" } disabled={disabled} onClick={onClick}>{children}</Button>;
  }





    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>

   
      <DialogTrigger asChild>
        {
          actionType === "add" ? (
            <Button size={"icon"}>
            <PlusIcon className="h-6 w-6" />
          </Button>
          ) : (
            <Button variant={"secondary"} onClick={onClick}>{children}</Button>
          )
        }


    

      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
        {
          actionType === "add" ? "Add a new  pet" : "Edit a pet"
        
        }
          </DialogTitle>
          <PetForm actionType={actionType}
          
          onFormSubmission={ () => {
            flushSync(() => {
              setIsFormOpen(false);
            })
           
          }} />

        </DialogHeader>
        
        </DialogContent>
      </Dialog>
      
    );
 

 
 
}
