export const APP_NAME = "WedgeOps";
export const APP_DESCRIPTION =
  "AI-native ops suite for independent wedding planners.";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  settings: "/settings",
  api: {
    health: "/api/health",
    waitlist: "/api/waitlist",
    event: "/api/event",
  },
} as const;
