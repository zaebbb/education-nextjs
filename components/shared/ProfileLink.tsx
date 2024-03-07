import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  imgUrl: string
  title: string
  href?: string
}

const ProfileLink = (props: Props) => {
  const {
    imgUrl,
    title,
    href,
  } = props

  return (
    <div className="flex-center gap-1">
      <Image 
        src={imgUrl}
        alt={title}
        width={20}
        height={20}
      />

      {href ? (
        <Link 
          href={href} 
          className="paragraph-medium text-blue-500" 
          target="_blank"
        >
          {title}
        </Link>
      ) : (
        <p className="text-dark400_light700 paragraph-medium">
          {title}
        </p>
      )}
    </div>
  )
}

export default ProfileLink