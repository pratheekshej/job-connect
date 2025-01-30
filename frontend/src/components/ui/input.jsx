import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, fieldType = 'text', ...props }, ref) => {
  const classNameVal = "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  switch (fieldType) {
    case 'textArea': {
      return (
        <textarea
          type={type}
          ref={ref}
          className={cn(
            classNameVal,
            className,
            'h-20'
          )}
          {...props} />
      )
    }
  }
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        classNameVal,
        className,
        'h-10'
      )}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
