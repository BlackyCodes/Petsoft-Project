'use client'

import { useSearchContext } from '@/lib/hooks';
import React from 'react'

export default function SearchForm() {
  const {searchQuery, handleChangeSearchQuery} = useSearchContext();

  return (
    <form className='w-full h-full'>
        <input  className='w-full h-full bg-white/20 rounded-md outline-none transition focus-within:bg-white/50 hover:bg-white/30 placeholder:text-white/50' 
        placeholder='Search pets' 
        type='search'
        value={searchQuery}
        onChange={(e) => (handleChangeSearchQuery(e.target.value))}
        />
     
    </form>
  )
}
