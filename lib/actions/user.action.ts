"use server"

import User from "@/database/user.model"
import { connectToDB } from "../mongoose"

export const getUserById = async (params: any) => {
  try {
    await connectToDB()

    const {
      userId,
    } = params

    const user = await User.findOne({ 
      clerkId: userId,
    })

    return user
  } catch (error) {
    console.log(error);
  }
}