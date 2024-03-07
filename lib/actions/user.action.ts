"use server"

import User from "@/database/user.model"
import { connectToDB } from "../mongoose"
import { FilterQuery } from "mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import Answer from "@/database/answer.model"

export const getUserById = async (params: GetUserByIdParams) => {
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

export const createUser = async (
  params: CreateUserParams
) => {
  try {
    await connectToDB();

    const newUser = await User.create(params)
  
    return newUser
  } catch (error) {
    console.log(error);
  }
}

export const updateUser = async (
  params: UpdateUserParams
) => {
  const {
    clerkId,
    path,
    updateData,
  } = params

  try {
    await connectToDB();

    await User.findOneAndUpdate(
      { clerkId }, 
      updateData,
      { new: true }
    )
  
    revalidatePath(path)
  } catch (error) {
    console.log(error);
  }
}

export const deleteUser = async (
  params: DeleteUserParams
) => {
  const {
    clerkId,
  } = params

  try {
    await connectToDB();

    const user = await User.findOneAndDelete(
      { clerkId },
    )

    if (!user) {
      throw new Error('User Not Found')
    }

    // const userQuestionIds = await Question.find({
    //   author: user._id,
    // }).distinct('_id')

    await Question.deleteMany({
      author: user._id,
    })

    const deleteUser = await User.findByIdAndDelete(user._id)

    return deleteUser
  } catch (error) {
    console.log(error);
  }
}

export const getAllUsers = async (
  params: GetAllUsersParams
) => {
  try {
    await connectToDB()

    // const {
    //   filter,
    //   page = 1,
    //   pageSize = 20,
    //   searchQuery,
    // } = params

    const users = await User
      .find({})
      .sort({ createdAt: -1 })

    return {
      users,
    }
  } catch (error) {
    console.log(error);
  }
}

export const toggleSaveQuestion = async (
  params: ToggleSaveQuestionParams
) => {
  try {
    await connectToDB();

    const {
      path,
      questionId,
      userId,
    } = params

    const user = await User.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const isQuestionSaved = user.saved.includes(questionId)

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId, 
        { $pull: { saved: questionId } },
        { new: true }
      )
    } else {
      await User.findByIdAndUpdate(
        userId, 
        { $addToSet: { saved: questionId } },
        { new: true }
      )
    }
    
    revalidatePath(path)
  } catch (error) {
    console.log(error);
  }
}

export const getSavedQuestions = async (
  params: GetSavedQuestionsParams
) => {
  try {
    await connectToDB()

    const {
      clerkId,
      searchQuery,
    } = params

    const query: FilterQuery<typeof Question> = searchQuery ? { 
      title: {
        $regex: new RegExp(searchQuery, 'i')
      } 
    } : {}

    const user = await User
      .findOne({ clerkId })
      .populate({
        path: 'saved',
        match: query,
        options: {
          sort: { createdAt: -1 }
        },
        populate: [
          { path: 'tags', model: Tag, select: '_id name' },
          { path: 'author', model: User, select: '_id clerkId name picture' },
        ]
      })

    if (!user) {
      throw new Error('User not found')
    }

    const savedQuestions = user.saved

    return { 
      questions: savedQuestions, 
    }
  } catch (e) {
    console.log(e);
  }
}

export const getUserInfo = async (
  params: GetUserByIdParams
) => {
  try {
    await connectToDB()

    const {
      userId,
    } = params

    const user = await User.findOne({ 
      clerkId: userId,
    })

    if (!user) {
      throw new Error('User not found')
    }

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    return {
      user,
      totalQuestions,
      totalAnswers,
    }
  } catch (error) {
    console.log(error);
  }
}

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    await connectToDB()

    const {
      userId,
    } = params

    const totalQuestions = await Question.countDocuments({ 
      author: userId,
    })

    const userQuestions = await Question
      .find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name picture')
    

    return {
      totalQuestions,
      questions: userQuestions,
    }
  } catch (error) {
    console.log(error);
  }
}

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    await connectToDB()

    const {
      userId,
    } = params

    const totalAnswers = await Answer.countDocuments({ 
      author: userId,
    })

    const userAnswers = await Answer
      .find({ author: userId })
      .sort({ upvotes: -1 })
      .populate('question', '_id title')
      .populate('author', '_id clerkId name picture')
    

    return {
      totalAnswers,
      answers: userAnswers,
    }
  } catch (error) {
    console.log(error);
  }
}
