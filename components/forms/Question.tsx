"use client"

import React from 'react';
import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {QuestionsSchema} from "@/lib/validations";
import {Editor} from "@tinymce/tinymce-react";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {createQuestion} from "@/lib/actions/question.action";
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeProvider';

type Props = {
  mongoUserId: string
}

const type: any = 'create'

const Question = (props: Props) => {
  const { 
    mongoUserId,
  } = props

  const editorRef = React.useRef(null);
  const { mode } = useTheme()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: '',
      tags: [],
    },
  })

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true)

    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      })

      router.push('/')
    } catch (e) {

    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          form.setError('tags', {
            message: 'Max 15 symbols',
          })
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue])
          tagInput.value = ''
        }
      } else {
        form.trigger()
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    form.setValue(
      'tags',
      [
        ...field.value
          .filter((tagField: string) => tagField !== tag)
      ]
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem
              className={"flex w-full flex-col"}
            >
              <FormLabel className={"paragraph-semibold text-dark400_light800 font-bold"}>
                Question Title
                {' '}
                <span className={'text-primary-500'}>*</span>
              </FormLabel>

              <FormControl className={'mt-3.5'}>
                <Input
                  className={'no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-[56px] border'}
                  {...field}
                />
              </FormControl>

              <FormDescription
                className={"body-regular mt-2.5 text-light-500"}
              >
                Enter your question title
              </FormDescription>

              <FormMessage
                className={'text-red-500'}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem
              className={"flex w-full flex-col gap-3"}
            >
              <FormLabel className={"paragraph-semibold text-dark400_light800 font-bold"}>
                Detailed Question Explanation
                {' '}
                <span className={'text-primary-500'}>*</span>
              </FormLabel>

              <FormControl className={'mt-3.5'}>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor
                  }}
                  initialValue=""
                  onBlur={field.onBlur}
                  onEditorChange={(content) => {
                    field.onChange(content)
                  }}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist', 'codesample', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'code codesample | bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                    skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: mode === 'dark' ? 'dark' : 'light',
                  }}
                />
              </FormControl>

              <FormDescription
                className={"body-regular mt-2.5 text-light-500"}
              >
                Enter your question Explanation
              </FormDescription>

              <FormMessage
                className={'text-red-500'}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem
              className={"flex w-full flex-col"}
            >
              <FormLabel className={"paragraph-semibold text-dark400_light800 font-bold"}>
                Question Tags
                {' '}
                <span className={'text-primary-500'}>*</span>
              </FormLabel>

              <FormControl className={'mt-3.5'}>
                <>
                  <Input
                    className={'no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-[56px] border'}
                    placeholder={"Add tags"}
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {Boolean(field.value.length) && (
                    <div className={'flex-start mt-2.5 gap-2.5'}>
                      {field.value.map(tag => (
                        <Badge
                          key={tag}
                          className={'subtle-medium background-light800_dark300 text-light400_light500 items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'}
                        >
                          {tag}

                          <Image
                            src={'/assets/icons/close.svg'}
                            alt={'Close icon'}
                            width={12}
                            height={12}
                            className={'cursor-pointer object-contain invert-0 dark:invert'}
                            onClick={() => handleTagRemove(tag, field)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>

              </FormControl>

              <FormDescription
                className={"body-regular mt-2.5 text-light-500"}
              >
                Add tags to question
              </FormDescription>

              <FormMessage
                className={'text-red-500'}
              />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={'primary-gradient w-fit !text-light-900'}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              {type === 'edit' ? 'Editing...' : 'Posting...'}
            </>
          ) : (
            <>
              {type === 'edit' ? 'Edit Question' : 'Ask a Question'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
