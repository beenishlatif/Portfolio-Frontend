import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const THEMES = [
  { id: "purple", label: "Purple" },
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio-theme") || "purple";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
