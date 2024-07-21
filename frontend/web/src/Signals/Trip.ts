import { signal } from "@preact/signals-react";

// This was extracted out of the Expenses.tsx file since having multiple exports breaks fast refresh for react
export const currentTripId = signal("");
// TODO: make trips/create return the trip object instead of just its id; then, this can all be merged into one trip object
export const currentTripInfo = signal({ name: "", description: "" });
