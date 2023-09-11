import { ButtonHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = {
  ref?: React.Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="submit"
      {...props}
      className={twMerge(
        'transition-all hover:scale-[98%] active:scale-[102%] disabled:bg-gray disabled:pointer-events-none bg-green text-black rounded-lg hover:bg-white w-56 h-8',
        className
      )}
    />
  )
})

Button.displayName = 'Button'

export default Button
