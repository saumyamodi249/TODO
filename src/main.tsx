import { StrictMode, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";
import App from "./App.tsx";
import "./index.css";

type ColorScheme = "light" | "dark";

const systemThemeQuery = "(prefers-color-scheme: dark)";

function getThemeColor(variable: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${variable})`;
  document.documentElement.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function getColorScheme(): ColorScheme {
  const colorScheme = document.documentElement.dataset.colorScheme;
  if (colorScheme === "dark" || colorScheme === "light") return colorScheme;

  return window.matchMedia(systemThemeQuery).matches ? "dark" : "light";
}

function subscribeToColorScheme(onChange: () => void) {
  const rootObserver = new MutationObserver(onChange);
  rootObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-color-scheme"],
  });

  const systemTheme = window.matchMedia(systemThemeQuery);
  systemTheme.addEventListener("change", onChange);

  return () => {
    rootObserver.disconnect();
    systemTheme.removeEventListener("change", onChange);
  };
}

export function Root() {
  const colorScheme = useSyncExternalStore(
    subscribeToColorScheme,
    getColorScheme,
    () => "light",
  );
  const isDark = colorScheme === "dark";
  const themeRadius = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--theme-radius",
    ),
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: getThemeColor("--theme-color-primary"),
          colorSuccess: getThemeColor("--theme-color-success"),
          colorWarning: getThemeColor("--theme-color-warning"),
          colorError: getThemeColor("--theme-color-error"),
          colorTextBase: getThemeColor("--theme-color-font"),
          colorText: getThemeColor("--theme-color-font"),
          colorTextSecondary: getThemeColor("--theme-color-font-secondary"),
          colorTextTertiary: getThemeColor("--theme-color-font-tertiary"),
          colorBgBase: getThemeColor("--theme-color-background"),
          colorBgLayout: getThemeColor("--theme-color-background-secondary"),
          colorBgContainer: getThemeColor("--theme-color-background"),
          colorBgElevated: getThemeColor("--theme-color-background-secondary"),
          colorBorder: getThemeColor("--theme-color-border"),
          colorBorderSecondary: getThemeColor("--theme-color-border"),
          borderRadius: themeRadius,
        },
        components: {
          Segmented: {
            itemSelectedBg: getThemeColor("--theme-color-primary"),
            itemSelectedColor: getThemeColor("--theme-color-on-brand"),
          },
          Divider: {
            marginLG: 0,
          },
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
