"use server"

import {connectToDB} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export const getQuestions = async (
  params: GetQuestionsParams
) => {
  try {
    await connectToDB()

    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })

    return { 
      questions, 
    }
  } catch (e) {
    console.log(e);
  }
}

export const createQuestion = async (
  params: CreateQuestionParams
) => {
  try {
    await connectToDB()

    const {
      title,
      content,
      tags,
      author,
      path,
    } = params

    const question = await Question.create({
      title,
      content,
      author,
    })

    const tagDocuments = []

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { 
          name: { 
            $regex: new RegExp(`^${tag}&`, 'i') 
          } 
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $push: {
            questions: question._id,
          }
        },
        {
          upsert: true,
          new: true,
        }
      )

      tagDocuments.push(existingTag._id)
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: {
          $each: tagDocuments,
        }
      }
    })

    revalidatePath(path)
  } catch (e) {

  }
}

export const getQuestionById = async (
  params: GetQuestionByIdParams
) => {
  try {
    await connectToDB()

    const {
      questionId,
    } = params

    const question = await Question
      .findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({ path: 'author', model: User, select: '_id clerkId name picture' })

      return question
  } catch (error) {
    console.log(error);
    
  }
}

export const upvoteQuestion = async (
  params: QuestionVoteParams
) => {
  try {
    await connectToDB()

    const {
      hasdownVoted,
      hasupVoted,
      path,
      questionId,
      userId,
    } = params

    let updateQuery = {}

    if (hasupVoted) {
      updateQuery = { 
        $pull: { 
          upvotes: userId 
        } 
      }
    } else if (hasdownVoted) {
      updateQuery = { 
        $pull: { 
          downvotes: userId 
        },
        $push: { 
          upvotes: userId 
        } 
      }
    } else {
      updateQuery = {
        $addToSet: {
          upvotes: userId
        }
      }
    }

    const question = await Question.findByIdAndUpdate(
      questionId, 
      updateQuery,
      {
        new: true,
      }
    )

    if (!question) {
      throw new Error('Question not found')
    }
    
    revalidatePath(path)
  } catch (e) {
    console.log(e);
  }
}

export const downvoteQuestion = async (
  params: QuestionVoteParams
) => {
  try {
    await connectToDB()

    const {
      hasdownVoted,
      hasupVoted,
      path,
      questionId,
      userId,
    } = params

    let updateQuery = {}

    if (hasdownVoted) {
      updateQuery = { 
        $pull: { 
          downvotes: userId 
        } 
      }
    } else if (hasupVoted) {
      updateQuery = { 
        $pull: { 
          upvotes: userId 
        },
        $push: { 
          downvotes: userId 
        } 
      }
    } else {
      updateQuery = {
        $addToSet: {
          downvotes: userId
        }
      }
    }

    const question = await Question.findByIdAndUpdate(
      questionId, 
      updateQuery,
      {
        new: true,
      }
    )

    if (!question) {
      throw new Error('Question not found')
    }
    
    revalidatePath(path)
  } catch (e) {
    console.log(e);
  }
}
