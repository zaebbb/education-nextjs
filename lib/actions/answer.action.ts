"use server"

import {connectToDB} from "@/lib/mongoose";
import Question from "@/database/question.model";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";

export const createAnswer = async (
  params: CreateAnswerParams
) => {
  try {
    await connectToDB()

    const {
      content,
      author,
      path,
      question,
    } = params

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    })

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id }
    })

    revalidatePath(path)
  } catch (e) {
    console.log(e);
  }
}

export const getAnswers = async (
  params: GetAnswersParams
) => {
  try {
    await connectToDB()
    
    const {
      questionId,
    } = params

    const answers = await Answer
      .find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort({ createdAt: -1 })

    return {
      answers,
    }
  } catch (e) {
    console.log(e);
  }
} 

export const upvoteAnswer = async (
  params: AnswerVoteParams
) => {
  try {
    await connectToDB()

    const {
      hasdownVoted,
      hasupVoted,
      path,
      answerId,
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

    const answer = await Answer.findByIdAndUpdate(
      answerId, 
      updateQuery,
      {
        new: true,
      }
    )

    if (!answer) {
      throw new Error('Answer not found')
    }
    
    revalidatePath(path)
  } catch (e) {
    console.log(e);
  }
}

export const downvoteAnswer = async (
  params: AnswerVoteParams
) => {
  try {
    await connectToDB()

    const {
      hasdownVoted,
      hasupVoted,
      path,
      userId,
      answerId,
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

    const answer = await Answer.findByIdAndUpdate(
      answerId, 
      updateQuery,
      {
        new: true,
      }
    )

    if (!answer) {
      throw new Error('Answer not found')
    }
    
    revalidatePath(path)
  } catch (e) {
    console.log(e);
  }
}
