import { NextRequest, NextResponse } from "next/server";
import { getProfileVersion } from "@/lib/cache";

/**
 * Data fingerprint for one profile. The client polls this instead of
 * re-requesting the full payloads, and drops its cache when the value moves.
 * Deliberately tiny and tagged, so it is near-free to call.
 */
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const version = await getProfileVersion(context.params.id);
    return NextResponse.json(
      { version },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=60" } }
    );
  } catch (error) {
    console.error("[VERSION_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
