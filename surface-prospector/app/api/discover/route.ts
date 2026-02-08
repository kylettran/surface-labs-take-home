import { NextResponse } from "next/server";
import { dataProvider } from "@/lib/data-provider";
import { estimateDriveScoreTotal } from "@/lib/drive-scorer";
import { filterCompaniesForRotation, getRotationForDate } from "@/lib/rotation";

export const runtime = "nodejs";

export async function GET() {
  const rotation = getRotationForDate(new Date());
  const filtered = filterCompaniesForRotation(dataProvider.getCompanies(), rotation);
  const sorted = [...filtered].sort(
    (a, b) => estimateDriveScoreTotal(b) - estimateDriveScoreTotal(a)
  );

  return NextResponse.json({
    rotation,
    total: sorted.length,
    topFive: sorted.slice(0, 5),
    accounts: sorted,
  });
}
