"use server"

import {connectToDB} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
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
            question: question._id,
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
