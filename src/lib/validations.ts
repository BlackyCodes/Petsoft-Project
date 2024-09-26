import { z } from "zod";
import { DEFAULT_PET_IMAGE_URL } from "./constants";

export const petIdSchema = z.string().cuid();


export  const petFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(50, "Name is too long)."),
    ownerName: z.string().trim().min(1, "Owner name is required").max(50, "Owner name is too long"),
  
    imageUrl: z.union([z.literal(''), z.string().trim().url({ message: 'Image url must be valid URL' })]),
    age: z.coerce.number().int().positive("Age must be a positive number").max(99000),
    notes: z.union([z.literal(''), z.string().trim().max(500, "Notes is too long")]),
  }).transform(data => (
    {
      ...data,
      imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL
    }
  ))

 export  type TPetForm = z.infer<typeof petFormSchema>;



 export const authSchema = z.object({
      email: z.string().email("Invalid email address").max(100),
      password: z.string().max(100),
      

 })

 export type TAuth = z.infer<typeof authSchema>