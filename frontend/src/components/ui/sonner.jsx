/* toast: "flex flex-row items-top group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg p-3",
description: "group-[.toast]:text-muted-foreground",
actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground", */

import { Toaster as Sonner } from 'sonner';
import { useTheme } from "next-themes";

const SonnerToaster = () => {
  const { theme = "light" } = useTheme();
  const toastOptions = {
    classNames: {
      toast: "shadow-lg p-3 w-auto max-w-[250px] right-0",
    },
  }

  return (
    <Sonner
      theme={theme}
      visibleToasts={1}
      className="group toaster"
      closeButton
      richColors
      toastOptions={toastOptions}
      position={'bottom-right'}
    />
  );
};

export default SonnerToaster;
