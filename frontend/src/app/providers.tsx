"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { notifications } from "@mantine/notifications";

// Define the shape of the theme context
interface ThemeContextType {
  theme: "theme-dark" | "theme-light";
  toggleTheme: () => void;
}

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ThemeProvider component
export default function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"theme-dark" | "theme-light">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("runevolve-theme");
      if (storedTheme === "theme-light" || storedTheme === "theme-dark") {
        return storedTheme;
      }
      return document.body.classList.contains("theme-light")
        ? "theme-light"
        : "theme-dark";
    }
    return "theme-dark"; // Default for SSR
  });

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("runevolve-theme", theme);
    }
  }, [theme]);

  // Global listener for React hydration errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message && e.message.toLowerCase().includes("hydration")) {
        notifications.show({
          title: "Hydration Error",
          message:
            "There was a problem loading this page. Refresh to continue.",
          color: "red",
        });
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "theme-dark" ? "theme-light" : "theme-dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
