import React, { createContext, useContext, useState, ReactNode } from "react";
import { render, act, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// 主题类型
type Theme = "light" | "dark" | "tiger" | "sweet" | "dongzhu" | "kaige";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // 模拟更新 document class
    document.documentElement.classList.remove("light", "dark", "tiger", "sweet", "dongzhu", "kaige");
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const isDark = theme === "dark" || theme === "tiger" || theme === "dongzhu";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// 测试组件
const TestThemeToggle = () => {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  return (
    <div data-testid="theme-container" data-theme={theme} data-is-dark={isDark}>
      <div data-testid="current-theme">当前主题: {theme}</div>
      <button data-testid="toggle-btn" onClick={toggleTheme}>
        切换主题
      </button>
      <button data-testid="set-light" onClick={() => setTheme("light")}>
        切换到浅色
      </button>
      <button data-testid="set-dark" onClick={() => setTheme("dark")}>
        切换到深色
      </button>
      <button data-testid="set-tiger" onClick={() => setTheme("tiger")}>
        切换到虎将主题
      </button>
      <button data-testid="set-sweet" onClick={() => setTheme("sweet")}>
        切换到甜筒主题
      </button>
    </div>
  );
};

describe("主题切换集成测试", () => {
  beforeEach(() => {
    // 清理 document class
    document.documentElement.className = "";
  });

  afterEach(() => {
    cleanup();
  });

  test("TC-THEME-001: 默认主题应该是浅色", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeToggle />
      </ThemeProvider>
    );

    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: light");
    expect(getByTestId("theme-container")).toHaveAttribute("data-theme", "light");
    expect(getByTestId("theme-container")).toHaveAttribute("data-is-dark", "false");
  });

  test("TC-THEME-002: 切换按钮应该正确切换主题", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeToggle />
      </ThemeProvider>
    );

    // 初始状态
    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: light");

    // 点击切换
    act(() => {
      fireEvent.click(getByTestId("toggle-btn"));
    });

    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: dark");
    expect(getByTestId("theme-container")).toHaveAttribute("data-is-dark", "true");

    // 再次切换
    act(() => {
      fireEvent.click(getByTestId("toggle-btn"));
    });

    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: light");
    expect(getByTestId("theme-container")).toHaveAttribute("data-is-dark", "false");
  });

  test("TC-THEME-003: 直接设置主题应该正确工作", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeToggle />
      </ThemeProvider>
    );

    // 切换到深色
    act(() => {
      fireEvent.click(getByTestId("set-dark"));
    });
    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: dark");

    // 切换到虎将主题
    act(() => {
      fireEvent.click(getByTestId("set-tiger"));
    });
    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: tiger");
    expect(getByTestId("theme-container")).toHaveAttribute("data-is-dark", "true");

    // 切换到甜筒主题
    act(() => {
      fireEvent.click(getByTestId("set-sweet"));
    });
    expect(getByTestId("current-theme")).toHaveTextContent("当前主题: sweet");
    expect(getByTestId("theme-container")).toHaveAttribute("data-is-dark", "false");
  });

  test("TC-THEME-004: 主题切换应该更新 document class", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeToggle />
      </ThemeProvider>
    );

    // 初始状态 - 点击设置 light 主题来初始化 document class
    act(() => {
      fireEvent.click(getByTestId("set-light"));
    });
    expect(document.documentElement.classList.contains("light")).toBe(true);

    // 切换到 dark
    act(() => {
      fireEvent.click(getByTestId("set-dark"));
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);

    // 切换到 tiger
    act(() => {
      fireEvent.click(getByTestId("set-tiger"));
    });

    expect(document.documentElement.classList.contains("tiger")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("TC-THEME-005: 多个组件应该共享同一个主题状态", () => {
    const TestChildComponent = () => {
      const { theme, isDark } = useTheme();
      return (
        <div data-testid="child-component" data-child-theme={theme} data-child-is-dark={isDark}>
          子组件
        </div>
      );
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeToggle />
        <TestChildComponent />
      </ThemeProvider>
    );

    // 初始状态一致
    expect(getByTestId("child-component")).toHaveAttribute("data-child-theme", "light");

    // 切换主题
    act(() => {
      fireEvent.click(getByTestId("set-dark"));
    });

    // 子组件也应该更新
    expect(getByTestId("child-component")).toHaveAttribute("data-child-theme", "dark");
    expect(getByTestId("child-component")).toHaveAttribute("data-child-is-dark", "true");
  });
});
