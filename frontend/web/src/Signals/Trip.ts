import { signal } from "@preact/signals-react";
import { Trip } from "../utility/api/types/Responses";

// This was extracted out of the Expenses.tsx file since having multiple exports breaks fast refresh for react
export const currentTrip = signal<Trip | null>(null);
