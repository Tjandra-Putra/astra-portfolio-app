import type { Appearance } from "@clerk/types";

/**
 * Clerk theming mapped onto the Glass Stage tokens.
 *
 * Clerk ships a LIGHT theme by default, so on our dark panel its heading,
 * labels, divider and social-button text all rendered dark-on-dark and
 * effectively disappeared. Only the primary button and links were visible
 * because those were the two variables previously overridden.
 *
 * `colorAlphaShade` matters most: on Clerk v4 it is what borders, dividers and
 * muted surfaces are derived from, so it has to invert with the theme or
 * everything structural stays near-black. Concrete values rather than
 * `var(--…)` because Clerk computes alpha variants from these, which needs a
 * real colour.
 */
export function clerkAppearance(isDark: boolean): Appearance {
  return {
    variables: {
      colorPrimary: isDark ? "#e05215" : "#d94d12",
      colorTextOnPrimaryBackground: "#ffffff",
      colorText: isDark ? "#f4f4f2" : "#0a0a0c",
      colorTextSecondary: isDark ? "#c2c2cb" : "#3d3d43",
      // The card sits inside our own glass panel.
      colorBackground: "transparent",
      colorInputBackground: isDark ? "#26262b" : "#ffffff",
      colorInputText: isDark ? "#f4f4f2" : "#0a0a0c",
      colorAlphaShade: isDark ? "#ffffff" : "#0a0a0c",
      colorDanger: isDark ? "#ff6b5e" : "#c0362c",
      borderRadius: "0.625rem",
      fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
      fontSize: "0.9375rem",
    },
    elements: {
      rootBox: "w-full",
      card: "shadow-none bg-transparent w-full",
      headerTitle: "tracking-tight",
      // Clerk's social button defaults to a light surface.
      socialButtonsBlockButton:
        "border border-[color:var(--hairline-2)] bg-[color:var(--glass-lite)] text-[color:var(--ink)] hover:bg-[color:var(--glass-bright)]",
      formFieldInput: "border border-[color:var(--hairline-2)]",
      dividerLine: "bg-[color:var(--hairline-2)]",
      dividerText: "text-[color:var(--muted-ink)]",
      formFieldLabel: "text-[color:var(--ink)]",
      identityPreviewText: "text-[color:var(--ink)]",
      formResendCodeLink: "text-[color:var(--acc-text)]",
      footerActionText: "text-[color:var(--ink-soft)]",
      footerActionLink: "text-[color:var(--acc-text)] hover:opacity-80",
    },
  };
}
