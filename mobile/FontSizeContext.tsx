import React, { createContext, useContext, useState } from "react";

export type FontSizeContextType = {
  scale: number;
  setScale: (s: number) => void;
};

const FontSizeContext = createContext<FontSizeContextType>({
  scale: 1,
  setScale: () => {},
});

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scale, setScale] = useState(1);
  return (
    <FontSizeContext.Provider value={{ scale, setScale }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontScale = () => useContext(FontSizeContext);

