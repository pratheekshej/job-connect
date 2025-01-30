import React, { createContext, useContext } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import usePopOverAction from "@/hooks/usePopOverAction"; // Import the custom hook

// Create a context for popover actions
const PopoverContext = createContext();

const Popover = ({ children }) => {
  const { isPopoverOpen, handleOpenChange, setIsPopoverOpen } = usePopOverAction();

  return (
    <PopoverContext.Provider value={{ setIsPopoverOpen }}>
      <PopoverPrimitive.Root open={isPopoverOpen} onOpenChange={handleOpenChange}>
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    // Access setIsPopoverOpen from context
    const { setIsPopoverOpen } = useContext(PopoverContext);

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          onClick={() => setIsPopoverOpen(false)} // Close the popover
          className={cn(
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
