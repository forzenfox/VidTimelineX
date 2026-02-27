/**
 * 选中状态CSS变量测试
 * 测试文件：selected-state.test.tsx
 * 描述：测试选中状态相关的CSS变量定义和应用
 */

import { render } from "@testing-library/react";
import React from "react";
import fs from "fs";
import path from "path";

/**
 * 测试组件 - 用于测试选中状态属性应用
 */
const TestComponent: React.FC<{ "data-active"?: boolean; "aria-pressed"?: boolean }> = props => {
  return (
    <button
      data-active={props["data-active"]}
      aria-pressed={props["aria-pressed"]}
      data-testid="test-button"
    >
      Test Button
    </button>
  );
};

describe("Selected State CSS Variables", () => {
  let variablesCss: string;

  beforeAll(() => {
    const cssPath = path.join(__dirname, "../../../src/styles/variables.css");
    variablesCss = fs.readFileSync(cssPath, "utf-8");
  });

  describe("CSS Variable Definitions", () => {
    it("should define --selected-bg variable in :root", () => {
      expect(variablesCss).toContain("--selected-bg");
    });

    it("should define --selected-foreground variable in :root", () => {
      expect(variablesCss).toContain("--selected-foreground");
    });

    it("should define --selected-border variable in :root", () => {
      expect(variablesCss).toContain("--selected-border");
    });

    it("should define --selected-shadow-color variable in :root", () => {
      expect(variablesCss).toContain("--selected-shadow-color");
    });
  });

  describe("Kaige Theme Variables", () => {
    it("should have kaige theme selected state variables", () => {
      expect(variablesCss).toMatch(/\[data-theme="kaige"\][\s\S]*--selected-bg:\s*#e74c3c/);
    });

    it("should have white foreground for kaige theme", () => {
      expect(variablesCss).toMatch(/\[data-theme="kaige"\][\s\S]*--selected-foreground:\s*#fff/);
    });
  });

  describe("Blood Theme Variables", () => {
    it("should have blood theme selected state variables", () => {
      expect(variablesCss).toMatch(/\[data-theme="blood"\][\s\S]*--selected-bg:\s*#e11d48/);
    });
  });

  describe("Mix Theme Variables", () => {
    it("should have mix theme selected state variables", () => {
      expect(variablesCss).toMatch(/\[data-theme="mix"\][\s\S]*--selected-bg:\s*#f59e0b/);
    });
  });

  describe("Dongzhu Theme Variables", () => {
    it("should have dongzhu theme selected state variables", () => {
      expect(variablesCss).toMatch(/\[data-theme="dongzhu"\][\s\S]*--selected-bg:\s*#5dade2/);
    });
  });

  describe("Sweet Theme Variables", () => {
    it("should have sweet theme selected state variables", () => {
      expect(variablesCss).toMatch(
        /\[data-theme="sweet"\][\s\S]*--selected-bg:\s*var\(--sweet-primary\)/
      );
    });
  });
});

describe("Selected State Component Attributes", () => {
  describe("data-active attribute", () => {
    it('should apply data-active="true" when active', () => {
      const { getByTestId } = render(<TestComponent data-active={true} />);
      const button = getByTestId("test-button");

      expect(button).toHaveAttribute("data-active", "true");
    });

    it('should apply data-active="false" when not active', () => {
      const { getByTestId } = render(<TestComponent data-active={false} />);
      const button = getByTestId("test-button");

      expect(button).toHaveAttribute("data-active", "false");
    });
  });

  describe("aria-pressed attribute", () => {
    it('should apply aria-pressed="true" when pressed', () => {
      const { getByTestId } = render(<TestComponent aria-pressed={true} />);
      const button = getByTestId("test-button");

      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it('should apply aria-pressed="false" when not pressed', () => {
      const { getByTestId } = render(<TestComponent aria-pressed={false} />);
      const button = getByTestId("test-button");

      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });
});

describe("Selected State CSS Styles", () => {
  let componentsCss: string;

  beforeAll(() => {
    const cssPath = path.join(__dirname, "../../../src/styles/components.css");
    componentsCss = fs.readFileSync(cssPath, "utf-8");
  });

  describe("Global Selected State Styles", () => {
    it('should have styles for [data-active="true"]', () => {
      expect(componentsCss).toContain('[data-active="true"]');
    });

    it('should have styles for [aria-pressed="true"]', () => {
      expect(componentsCss).toContain('[aria-pressed="true"]');
    });

    it("should use --selected-bg variable", () => {
      expect(componentsCss).toContain("var(--selected-bg)");
    });

    it("should use --selected-foreground variable", () => {
      expect(componentsCss).toContain("var(--selected-foreground)");
    });

    it("should use --selected-shadow-color variable", () => {
      expect(componentsCss).toContain("var(--selected-shadow-color)");
    });
  });
});
