"use server";

import prisma from "@/lib/db";


import { revalidatePath } from "next/cache";

import { authSchema, petFormSchema,petIdSchema } from "@/lib/validations";
import {  signIn, signOut } from "@/lib/auth";
import bycrypt from 'bcryptjs'

import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
//user Actions
export async function logIn(prevState:unknown,formData:unknown) {
  
  if(!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn('credentials',  formData)
  } catch (error) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin': {
          return {
            message: "Invalid credentials.",
          }
        }
          default: {
            return {
              message: " Error Could not sign  in.",
            }
          }

        }

      }
      throw error 
    }
  



  






  

}

export async function signUp(prevState:unknown, formData:unknown) {

  // check if form dat is formdata type
  if(!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  const formDataEntries = Object.fromEntries(formData.entries())
  const validatedFormData = authSchema.safeParse(formDataEntries)

  if(!validatedFormData.success) {
    return {
      message: "Invalid form data."
      
    };
  }

  const {email, password} = validatedFormData.data

  const hashedPassword =  await bycrypt.hash(password, 10)
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword
      },
    });
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError)
    {
      if(error.code === 'P2002') {
        return {
          message: "Email already exists.",
        };
      }
    }
  }
 

  await signIn('credentials',  formData)




 
  }


export async function logOut() {

  await signOut( {redirectTo: '/'})
  
}






//pet Actions
export async function addPet(pet: unknown) {

  const session = await checkAuth()

 const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
      errors: validatedPet.error.errors,
    };
  }
  try { 
    await prisma.pet.create({
      data: {...validatedPet.data, user : {
        connect:{
          id: session.user.id
        }
      } }
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(pedId: unknown, newPetData: unknown) {
 
  const session = await checkAuth()


  const validatedPet = petFormSchema.safeParse(newPetData );
  const validatedPetId = petIdSchema.safeParse(pedId)
  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data.",

    };
  }

  const pet  = await getPetById(validatedPetId.data)

  if(!pet) {
    return {
      message: "Pet not found.",
    };  
  }

if(pet.userId !== session.user.id) {
  return {
    message: "not authorized ",
  };


}
  

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
   
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}



export async function deletePet(petId: unknown) {

  const session = await checkAuth()

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID.",
    };
  }
//authirization check user own pet
  const pet = await getPetById(validatedPetId.data)


  if(!pet) {
    return {
      message: "Pet not found.",
    };  
  }

if(pet.userId !== session.user.id) {
  return {
    message: "not authorized ",
  };

}

  try {
    await prisma.pet.delete({
      
      where: {
        id: validatedPetId.data,


      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}


//payments actions  //
export async function createCheckoutSession() {
  const session = await checkAuth()
 const checkoutSession =  await stripe.checkout.sessions.create({
  customer_email: session.user.email,
  line_items: [
    {
      price: 'price_1Q1wnzHcsrkENSKxUSCaubED',
      quantity: 1
    }

  ],
  mode: 'payment',
  success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
  cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=false`
 })

  redirect(checkoutSession.url)


}