import { cn } from '@/lib/utils'
import React from 'react'
type ContentProps = {
  children: React.ReactNode
  className?: string
}


export default function ContentBlock({children,className} : ContentProps
  
    
) {
  return (
    <div className={ cn('bg-[#f7f8fa] shadow-sm rounded-md overflow-hidden w-full h-full',className)}>{children}</div>
  )
}
