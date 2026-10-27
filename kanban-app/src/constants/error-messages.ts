export const ERROR_MESSAGES = {
  LOAD_BOARD: "Failed to load board",
  LOAD_CARD: "Failed to load card",
  LOAD_USERS: "Failed to load users",
  CREATE_CARD: "Failed to create card",
  UPDATE_CARD: "Failed to update card",
  DELETE_CARD: "Failed to delete card",
  MOVE_CARD: "Failed to move card",
  TOGGLE_SUBTASK: "Failed to update checklist item",
} as const;

export const ERROR_DETAILS = {
  NETWORK: "Network error",
  DELETE: "Delete failed",
} as const;

export const CARD_ERROR_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  DESCRIPTION_MIN_LENGTH: "Description must be at least 5 characters",
} as const;