"use client";

import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "./storage";

export function useStorageSnapshot() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
