import { NextResponse } from "next/server";
import { db } from "@/db";
import { tokens, activities, holdings } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/db-init";
import { desc, asc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDbSeeded();

    const allTokens = await db.select().from(tokens).orderBy(asc(tokens.id));
    const allActivities = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.id))
      .limit(100);
    const allHoldings = await db.select().from(holdings).orderBy(asc(holdings.id));

    return NextResponse.json({
      tokens: allTokens,
      activities: allActivities,
      holdings: allHoldings,
    });
  } catch (error) {
    console.error("Failed to fetch state:", error);
    return NextResponse.json({ error: "Failed to load state" }, { status: 500 });
  }
}
