const storageKey = "phoenix-theme";

export function ThemeScript() {
  const script = `(() => {
    const stored = localStorage.getItem("${storageKey}");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  })();`;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: script
      }}
    />
  );
}
