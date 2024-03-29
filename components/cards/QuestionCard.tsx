import React from 'react';
import Link from "next/link";
import RenderTag from "@/components/shared/RenderTag";
import Metric from "@/components/shared/Metric";
import {formatAndDivideNumber, getTimestamp} from "@/lib/utils";

export type Tag = {
  _id: string,
  name: string
}

export type Author = Tag & {
  picture: string
}

type Props = {
  _id: string
  clerkId?: string
  title: string
  tags: Tag[]
  author: Author
  upvotes: string[]
  views: number
  answers: Array<object>
  createdAt: Date
}

const QuestionCard = (props: Props) => {
  const {
    author,
    _id,
    tags,
    answers,
    createdAt,
    upvotes,
    views,
    title,
  } = props

  return (
    <div className={'card-wrapper rounded-[10px] p-9 sm:px-11'}>
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className={'subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'}>
            {getTimestamp(createdAt)}
          </span>

          <Link href={`/question/${_id}`}>
            <h3 className={'sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'}>
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map(tag => (
          <RenderTag
            _id={tag._id}
            key={tag._id}
            name={tag.name}
          />
        ))}
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

        <Metric
          imgUrl={'/assets/icons/message.svg'}
          alt={'message'}
          value={formatAndDivideNumber(answers.length)}
          title={' Answers'}
          className={'small-medium text-dark400_light800'}
        />

        <Metric
          imgUrl={'/assets/icons/eye.svg'}
          alt={'views'}
          value={formatAndDivideNumber(views)}
          title={' Views'}
          className={'small-medium text-dark400_light800'}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
