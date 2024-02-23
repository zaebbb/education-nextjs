"use client"

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select"

type FilterItem = {
  name: string
  value: string
}

type Props = {
  filters: FilterItem[]
  className?: string
  containerClassName?: string
}

const Filter = (props: Props) => {
  const {
    filters,
    containerClassName = '',
    className = '',
  } = props

  return (
    <div className={`relative ${containerClassName}`}>
      <Select>
        <SelectTrigger className={`${className} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className={'line-clamp-1 flex-1 text-left'}>
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map(filter => (
              <SelectItem
                value={filter.value}
                key={filter.value}
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
