type gemma4ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type gemma4Events = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?:gemma4ErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __gemma4Events?: gemma4Events;
  }
}

export function reportgemma4Error(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__gemma4Events?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
