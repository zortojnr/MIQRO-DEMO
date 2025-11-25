import { cva } from "class-variance-authority"
import { cn } from "../../lib/cn"
import { ButtonHTMLAttributes } from "react"

const buttonVariants = cva("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2", {
  variants: {
    variant: {
      default: "bg-brand-500 text-white hover:bg-brand-600",
      outline: "border border-slate-300 hover:bg-slate-50",
      ghost: "hover:bg-slate-100"
    },
    size: {
      default: "h-10 px-4",
      sm: "h-8 px-3",
      lg: "h-12 px-6"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function Button({ className, variant, size, ...props }: Props) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

