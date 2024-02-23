"use client"

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import RenderTag from "@/components/shared/RenderTag";

const questions = [
  { _id: '1', title: 'test 1' },
  { _id: '2', title: 'test 1' },
  { _id: '3', title: 'test 1' },
  { _id: '4', title: 'test 1' },
  { _id: '5', title: 'test 1' },
]

const tags = [
  { _id: '1', name: 'test', totalQuestions: 10 },
  { _id: '2', name: 'test', totalQuestions: 4 },
  { _id: '3', name: 'test', totalQuestions: 77 },
  { _id: '4', name: 'test', totalQuestions: 35 },
  { _id: '5', name: 'test', totalQuestions: 3 },
]

const RightSidebar = () => {
  return (
    <section className={'background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'}>
      <div>
        <h3 className={"h3-bold text-dark200_light900"}>
          Top Question
        </h3>

        <div className={"mt-7 flex w-full flex-col gap-[30px]"}>
          {questions.map(question => (
            <Link
              key={question._id}
              href={`/questions/${question._id}`}
              className={'flex cursor-pointer items-center justify-between gap-7'}
            >
              <p className={"body-medium text-dark500_light700"}>
                {question.title}
              </p>
              <Image
                src={'/assets/icons/chevron-right.svg'}
                alt={'Chevron right'}
                className={'invert-colors'}
                width={20}
                height={20}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className={"mt-16"}>
        <h3 className={"h3-bold text-dark200_light900"}>
          Popular Tags
        </h3>

        <div className={"mt-7 flex flex-col gap-4"}>
          {tags.map(tag => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
