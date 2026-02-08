"use client";

import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe as rawSubscribe } from "./storage";

let cachedSnapshot = getSnapshot();

function getCachedSnapshot() {
  return cachedSnapshot;
}

function subscribe(callback: () => void) {
  return rawSubscribe(() => {
    cachedSnapshot = getSnapshot();
    callback();
  });
}

export function useStorageSnapshot() {
  return useSyncExternalStore(subscribe, getCachedSnapshot, getCachedSnapshot);
}
