import QuestionCard, { Author, Tag } from '@/components/cards/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { IQuestion } from '@/database/question.model'
import { getQuestionByTagId } from '@/lib/actions/tag.action'
import { URLProps } from '@/types'
import React from 'react'

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
    pageSize: 10,
  })

  return (
    <>
      <h1 className={'h1-bold text-dark100_light900'}>
        {result?.tagTitle}
      </h1>

      <div className={'mt-11 w-full'}>
        <LocalSearchbar
          route={'/'}
          placeholder={'Search for questions'}
          className={'flex-1'}
        />
      </div>

      <div className={"mt-10 flex w-full flex-col gap-6"}>
        {result?.questions.map((question: IQuestion) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags as unknown as Tag[]}
            author={question.author as unknown as Author}
            upvotes={question.upvotes as unknown as string[]}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))}

        {!result?.questions.length && (
          <NoResult
            title={`There's no tag to show`}
            description={'Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'}
            link={'/ask-question'}
            linkTitle={'Ask a Question'}
          />
        )}
      </div>
    </>
  )
}

export default Page