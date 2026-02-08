import type { AccountStatus, DriveScore, OutboundEmail } from "./types";

const KEY_PREFIX = "surface-prospector";

const KEYS = {
  scores: `${KEY_PREFIX}:scores`,
  emails: `${KEY_PREFIX}:emails`,
  statuses: `${KEY_PREFIX}:statuses`,
  notes: `${KEY_PREFIX}:notes`,
  activity: `${KEY_PREFIX}:activity`,
};

const STORAGE_EVENT = "surface-prospector:storage";
const QUOTA_EVENT = "surface-prospector:quota";

type JsonMap<T> = Record<string, T>;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch (error) {
    if (isQuotaError(error)) {
      window.dispatchEvent(new Event(QUOTA_EVENT));
      return;
    }
    throw error;
  }
}

function isQuotaError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  return "name" in error && (error as { name?: string }).name === "QuotaExceededError";
}

export function subscribe(callback: () => void) {
  if (!isBrowser()) return () => undefined;

  const handler = () => callback();
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getSnapshot() {
  return {
    scores: readJson<JsonMap<DriveScore>>(KEYS.scores, {}),
    emails: readJson<JsonMap<OutboundEmail>>(KEYS.emails, {}),
    statuses: readJson<JsonMap<AccountStatus>>(KEYS.statuses, {}),
    notes: readJson<JsonMap<string>>(KEYS.notes, {}),
    activity: readJson<AccountStatus[]>(KEYS.activity, []),
  };
}

function updateMap<T>(key: string, updater: (current: JsonMap<T>) => JsonMap<T>) {
  const current = readJson<JsonMap<T>>(key, {});
  const next = updater(current);
  writeJson(key, next);
}

export const storage = {
  getDriveScore(companyId: string) {
    const { scores } = getSnapshot();
    return scores[companyId] ?? null;
  },
  setDriveScore(companyId: string, score: DriveScore) {
    updateMap(KEYS.scores, (current) => ({ ...current, [companyId]: score }));
  },
  getEmailDraft(companyId: string) {
    const { emails } = getSnapshot();
    return emails[companyId] ?? null;
  },
  setEmailDraft(companyId: string, draft: OutboundEmail) {
    updateMap(KEYS.emails, (current) => ({ ...current, [companyId]: draft }));
  },
  getAccountStatus(companyId: string) {
    const { statuses } = getSnapshot();
    return statuses[companyId] ?? null;
  },
  setAccountStatus(status: AccountStatus) {
    const normalized: AccountStatus = {
      ...status,
      updatedAt: status.updatedAt || new Date().toISOString(),
    };

    updateMap(KEYS.statuses, (current) => ({ ...current, [status.companyId]: normalized }));

    const { activity } = getSnapshot();
    const nextActivity = [normalized, ...activity].slice(0, 50);
    writeJson(KEYS.activity, nextActivity);
  },
  getAllStatuses() {
    const { statuses } = getSnapshot();
    return Object.values(statuses);
  },
  getRecentActivity() {
    const { activity } = getSnapshot();
    return activity.slice(0, 10);
  },
  getNotes(companyId: string) {
    const { notes } = getSnapshot();
    return notes[companyId] ?? null;
  },
  setNotes(companyId: string, notes: string) {
    updateMap(KEYS.notes, (current) => ({ ...current, [companyId]: notes }));
  },
  clearAll() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(KEYS.scores);
    window.localStorage.removeItem(KEYS.emails);
    window.localStorage.removeItem(KEYS.statuses);
    window.localStorage.removeItem(KEYS.notes);
    window.localStorage.removeItem(KEYS.activity);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  },
};
