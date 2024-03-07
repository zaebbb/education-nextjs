import { getUserAnswers } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import React from 'react'
import AnswerCard from '../cards/AnswerCard'

type Props = {
  userId: string
  clerkId: string | null
} & SearchParamsProps

const AnswerTab = async (props: Props) => {
  const {
    clerkId,
    userId,
  } = props

  const result = await getUserAnswers({
    userId,
    page: 1
  })
  
  return (
    <>
      {result?.answers.map(answer => (
        <AnswerCard 
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId ?? undefined}
          author={answer.author}
          upvotes={answer.upvotes}
          createdAt={answer.createdAt} 
          question={answer.question}
          />
      ))}
    </>
  )
}

export default AnswerTab