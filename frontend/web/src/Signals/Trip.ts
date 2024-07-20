import { signal } from "@preact/signals-react";

// This was extracted out of the Expenses.tsx file since having multiple exports breaks fast refresh for react
export const currentTripId = signal("");
