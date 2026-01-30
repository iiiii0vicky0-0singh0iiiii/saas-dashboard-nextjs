"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
