"use server"

import Question from "@/database/question.model"
import { connectToDB } from "../mongoose"
import { ViewQuestionParams } from "./shared.types"
import Interaction from "@/database/interaction.model"

export const viewQuestion = async (
  params: ViewQuestionParams
) => {
  try {
    await connectToDB()

    const {
      userId,
      questionId,
    } = params

    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 }
    })

    if (userId) {
      const existingInteraction = await Interaction.findOne({ 
        user: userId, 
        action: 'view',
        question: questionId,
      })

      if (!existingInteraction) {
        await Interaction.create({
          user: userId, 
          action: 'view',
          question: questionId,
        })
      }
    }
  } catch (error) {
    console.log(error);
  }
} 