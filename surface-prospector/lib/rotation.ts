import { Company } from "./types";

export const ROTATION_SCHEDULE = {
  1: { region: "NAM", sizeRange: [100, 500], label: "NAM Mid-Market" },
  2: { region: "NAM", sizeRange: [500, Infinity], label: "NAM Enterprise" },
  3: { region: "EMEA", sizeRange: [100, 500], label: "EMEA Mid-Market" },
  4: { region: "NAM", sizeRange: [50, 100], label: "NAM Growth" },
  5: { region: "APAC", sizeRange: [100, 500], label: "APAC Mid-Market" },
  0: { region: null, sizeRange: [0, Infinity], label: "All Accounts" },
  6: { region: null, sizeRange: [0, Infinity], label: "All Accounts" },
} as const;

export type RotationSegment = (typeof ROTATION_SCHEDULE)[keyof typeof ROTATION_SCHEDULE];

export function getRotationForDate(date = new Date()): RotationSegment {
  const day = date.getDay() as keyof typeof ROTATION_SCHEDULE;
  return ROTATION_SCHEDULE[day];
}

export function filterCompaniesForRotation(companies: Company[], segment: RotationSegment) {
  const [min, max] = segment.sizeRange;
  return companies.filter((company) => {
    const inRegion = segment.region ? company.region === segment.region : true;
    const inSize = company.employeeCount >= min && company.employeeCount <= max;
    return inRegion && inSize;
  });
}
