import { useEffect, useState } from "react";

/** Small delay used only to demonstrate the admin skeleton states. */
export const usePrototypeLoading = (delay = 350) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return isLoading;
};
