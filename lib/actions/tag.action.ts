"use server"

import User from "@/database/user.model"
import { connectToDB } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types"
import Tag, { ITag } from "@/database/tag.model"
import { FilterQuery } from "mongoose"
import Question from "@/database/question.model"

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    await connectToDB()

    const {
      userId,
    } = params

    const user = await User.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return [
      { _id: 'tag1', name: 'tag1' }, 
      { _id: 'tag2', name: 'tag2' }, 
      { _id: 'tag3', name: 'tag3' },
    ]
  } catch (error) {
    console.log(error);
  }
}

export const getAllTags = async (
  params: GetAllTagsParams
) => {
  try {
    await connectToDB()

    // const {
    //   filter,
    //   page = 1,
    //   pageSize = 20,
    //   searchQuery,
    // } = params

    const tags = await Tag
      .find({})
      .sort({ createdAt: -1 })

    return {
      tags,
    }
  } catch (error) {
    console.log(error);
  }
}

export const getQuestionByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    await connectToDB()

    const {
      tagId,
      searchQuery,
    } = params

    const tagFilter: FilterQuery<ITag> = { _id: tagId }

    const tag = await Tag
      .findOne(tagFilter)
      .populate({
        path: 'questions',
        model: Question,
        match: searchQuery ? { 
          title: {
            $regex: searchQuery,
            $options: 'i',
          } 
        } : {},
        options: {
          sort: { createdAt: -1 }
        },
        populate: [
          { path: 'tags', model: Tag, select: '_id name' },
          { path: 'author', model: User, select: '_id clerkId name picture' },
        ]
      })

    if (!tag) {
      throw new Error('Tag not found')
    }

    const questions = tag.questions

    return { 
      tagTitle: tag.name,
      questions, 
    }
  } catch (error) {
    console.log(error);
  }
}