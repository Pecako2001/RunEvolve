import React, { createContext, useState } from "react";
import { lightColors, darkColors, Colors } from "./theme";

export type ThemeContextType = {
  colors: Colors;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  darkMode: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((m) => !m);
  const colors = darkMode ? darkColors : lightColors;
  return (
    <ThemeContext.Provider value={{ colors, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
