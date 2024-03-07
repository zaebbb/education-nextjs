"use client"

import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action'
import { toggleSaveQuestion } from '@/lib/actions/user.action'
import { formatAndDivideNumber } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  type: 'question' | 'answer'
  itemId: string
  userId: string
  upvotes: number
  hasupVoted: boolean
  downvotes: number
  hasdownVoted: boolean
  hasSaved?: boolean
}

const Votes = (props: Props) => {
  const {
    type,
    itemId,
    userId,
    upvotes,
    hasupVoted,
    downvotes,
    hasdownVoted,
    hasSaved,
  } = props

  const pathname = usePathname()
  const router = useRouter()

  const handleSave = async () => {
    await toggleSaveQuestion({
      path: pathname,
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    })
  }

  const handleVote = async (action: string) => {
    if (!userId) {
      return
    }

    if (action === 'upvote') {
      if (type === 'question') {
        await upvoteQuestion({
          hasdownVoted,
          hasupVoted,
          path: pathname,
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        })
      } else if (type === 'answer') {
        await upvoteAnswer({
          hasdownVoted,
          hasupVoted,
          path: pathname,
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        })
      }

      return
    }

    if (action === 'downvote') {
      if (type === 'question') {
        await downvoteQuestion({
          hasdownVoted,
          hasupVoted,
          path: pathname,
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        })
      } else if (type === 'answer') {
        await downvoteAnswer({
          hasdownVoted,
          hasupVoted,
          path: pathname,
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        })
      }
    }
  }

  React.useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    })
  }, [itemId, userId, pathname, router])

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image 
            src={`/assets/icons/${hasupVoted ? 'upvoted' : 'upvote'}.svg`}
            alt={'upvote'}
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image 
            src={`/assets/icons/${hasdownVoted ? 'downvoted' : 'downvote'}.svg`}
            alt={'downvote'}
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === 'question' && (
        <Image 
          src={`/assets/icons/star-${hasSaved ? 'filled' : 'red'}.svg`}
          alt={'star'}
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  )
}

export default Votes