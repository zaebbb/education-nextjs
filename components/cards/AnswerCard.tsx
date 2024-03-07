import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import Metric from '../shared/Metric'

type Props = {
  clerkId?: string
  _id: string
  question: {
    _id: string
    title: string
  } 
  author: {
    _id: string
    picture: string
    name: string
  }
  upvotes: string
  createdAt: Date

}

const AnswerCard = (props: Props) => {
  const {
    _id,
    author,
    clerkId,
    createdAt,
    question,
    upvotes,
  } = props

  return (
    <Link 
      href={`/question/${question._id}/#${_id}`} 
      className="card-wrapper rounded-[10px] p-9 sm:px-11"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className={'subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'}>
            {getTimestamp(createdAt)}
          </span>

          <Link href={`/question/${_id}`}>
            <h3 className={'sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'}>
              {question.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={'/assets/icons/avatar.svg'}
          alt={'author'}
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          className={'body-medium text-dark400_light700'}
        />
        
        <Metric
          imgUrl={'/assets/icons/like.svg'}
          alt={'Upvotes'}
          value={formatAndDivideNumber(upvotes.length)}
          title={' Votes'}
          className={'small-medium text-dark400_light800'}
        />
      </div>
    </Link>
  )
}

export default AnswerCard