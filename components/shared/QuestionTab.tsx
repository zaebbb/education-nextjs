import { getUserQuestions } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import React from 'react'
import QuestionCard from '../cards/QuestionCard'

type Props = {
  userId: string
  clerkId: string | null
} & SearchParamsProps

const QuestionTab = async (props: Props) => {
  const {
    clerkId,
    searchParams,
    userId,
  } = props

  const result = await getUserQuestions({
    userId,
    page: 1
  })
  
  return (
    <>
      {result?.questions.map(question => (
        <QuestionCard 
          key={question._id}
          _id={question._id}
          clerkId={clerkId ?? undefined}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </>
  )
}

export default QuestionTab