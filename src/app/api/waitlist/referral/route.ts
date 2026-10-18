import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const code = (typeof body.code === "string" ? body.code : "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .slice(0, 16);

    if (!code) {
      return NextResponse.json({ error: "Missing or invalid referral code" }, { status: 400 });
    }

    const endpoint = process.env.APPWRITE_ENDPOINT || "https://syd.cloud.appwrite.io/v1";
    const projectId = process.env.APPWRITE_PROJECT_ID || "6acfd0f50000c85e0e60";
    const dbId = process.env.APPWRITE_DATABASE_ID || "cultureflow";
    const collId = process.env.APPWRITE_COLLECTION_ID || "waitlist";
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!apiKey) {
      console.error("[referral route] Missing APPWRITE_API_KEY");
      return NextResponse.json({ error: "Server configuration missing API key" }, { status: 500 });
    }

    const headers = {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
      "Content-Type": "application/json",
    };

    const query = JSON.stringify({
      method: "equal",
      attribute: "referralCode",
      values: [code],
    });

    const searchUrl = `${endpoint}/databases/${dbId}/collections/${collId}/documents?queries[]=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!searchRes.ok) {
      const err = await searchRes.text();
      console.error("[referral route] Appwrite lookup failed:", searchRes.status, err);
      return NextResponse.json({ error: "Referrer lookup failed" }, { status: searchRes.status });
    }

    const searchData = await searchRes.json();
    const referrer = searchData.documents?.[0];

    if (!referrer) {
      return NextResponse.json({ error: "Referrer code not found" }, { status: 404 });
    }

    const currentCount = typeof referrer.referralCount === "number" ? referrer.referralCount : 0;
    const patchUrl = `${endpoint}/databases/${dbId}/collections/${collId}/documents/${referrer.$id}`;

    const updateRes = await fetch(patchUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          referralCount: currentCount + 1,
        },
      }),
      cache: "no-store",
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("[referral route] Increment failed:", updateRes.status, err);
      return NextResponse.json({ error: "Failed to credit referrer" }, { status: updateRes.status });
    }

    const updatedData = await updateRes.json();
    return NextResponse.json({
      success: true,
      referralCount: updatedData.referralCount,
    });
  } catch (err) {
    console.error("[referral route] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
