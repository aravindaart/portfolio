// Cross-component signal: the command palette asks the terminal to enter
// AI mode without sharing state. Terminal owns the enabled/fallback logic.
export const TERMINAL_AI_EVENT = "terminal:ai";
