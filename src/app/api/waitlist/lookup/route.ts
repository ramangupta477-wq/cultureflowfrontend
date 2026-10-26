import { NextResponse } from "next/server";

/**
 * Find an existing waitlist signup by email or phone.
 * Returns only the fields the confirmation screen renders — never phone,
 * consent, or referral counts.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase();
    const phone = (typeof body.phone === "string" ? body.phone : "").replace(/[^\d+]/g, "");

    if (!email && !phone) {
      return NextResponse.json({ error: "Missing email or phone" }, { status: 400 });
    }

    const endpoint = process.env.APPWRITE_ENDPOINT || "https://syd.cloud.appwrite.io/v1";
    const projectId = process.env.APPWRITE_PROJECT_ID || "6acfd0f50000c85e0e60";
    const dbId = process.env.APPWRITE_DATABASE_ID || "cultureflow";
    const collId = process.env.APPWRITE_COLLECTION_ID || "waitlist";
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!apiKey) {
      console.error("[lookup route] Missing APPWRITE_API_KEY");
      return NextResponse.json({ error: "Server configuration missing API key" }, { status: 500 });
    }

    const headers = {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
      "Content-Type": "application/json",
    };

    // Two plain equal-queries beat OR syntax that varies across Appwrite versions.
    const searches: Array<Record<string, unknown>> = [];
    if (email) searches.push({ method: "equal", attribute: "email", values: [email] });
    if (phone) searches.push({ method: "equal", attribute: "phone", values: [phone] });

    for (const query of searches) {
      const url = `${endpoint}/databases/${dbId}/collections/${collId}/documents?queries[]=${encodeURIComponent(
        JSON.stringify(query)
      )}`;
      const res = await fetch(url, { method: "GET", headers, cache: "no-store" });

      if (!res.ok) {
        const err = await res.text();
        console.error("[lookup route] Appwrite lookup failed:", res.status, err);
        return NextResponse.json({ error: "Lookup failed" }, { status: res.status });
      }

      const data = await res.json();
      const doc = data.documents?.[0];
      if (doc) {
        return NextResponse.json({
          found: true,
          entry: {
            fullName: doc.fullName ?? "",
            email: doc.email ?? "",
            role: doc.role ?? "student",
            city: doc.city ?? "",
            college: doc.college ?? "",
            yearOfStudy: doc.yearOfStudy ?? "",
            tracks: Array.isArray(doc.tracks) ? doc.tracks : [],
            referralCode: doc.referralCode ?? "",
          },
        });
      }
    }

    return NextResponse.json({ found: false });
  } catch (err) {
    console.error("[lookup route] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
