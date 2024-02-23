"use client"

import React from 'react';
import Image from "next/image";
import {Input} from "@/components/ui/input";

type IconPosition = 'left' | 'right'

type Props = {
  route: string
  iconPosition?: IconPosition
  imgSrc?: string
  placeholder?: string
  className?: string
}

const LocalSearchbar = (props: Props) => {
  const {
    imgSrc = '/assets/icons/search.svg',
    placeholder = '',
    iconPosition = 'left',
    className = '',
  } = props

  return (
    <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${className}`}>
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt={'Search Icon'}
          width={24}
          height={24}
          className={'cursor-pointer'}
        />
      )}

      <Input
        type={'text'}
        placeholder={placeholder}
        className={'paragraph-regular no-focus placeholder background-light800_darkgradient w-full border-none shadow-none outline-none'}
        value={''}
        onChange={() => {}}
      />

      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt={'Search Icon'}
          width={24}
          height={24}
          className={'cursor-pointer'}
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
