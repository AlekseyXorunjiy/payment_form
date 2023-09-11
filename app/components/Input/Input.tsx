import React, { forwardRef, InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

const InputElement = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ type: initialType, className, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={initialType}
        className={twMerge(
          'bg-transparent w-full rounded-lg border px-3 py-3 outline-none',
          className
        )}
      />
    </div>
  )
})

InputElement.displayName = 'Input'

export default InputElement
