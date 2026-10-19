import { Client, Databases, ID, Query } from "appwrite";

// Values from APPWRITE_HANDOVER.md — project is live and tested
const client = new Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1")
  .setProject("6acfd0f50000c85e0e60");

const databases = new Databases(client);

export const WAITLIST_DB_ID = "cultureflow";
export const WAITLIST_COLLECTION_ID = "waitlist";
export const INSTITUTION_COLLECTION_ID = "institution_inquiries";

export type WaitlistRole = "student" | "parent" | "institution";
export type TrackId = "tech" | "sustainability" | "cultural";

export interface InstitutionInquiry {
  institutionType: string;
  institutionName: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  designation: string;
  email: string;
  mobile: string;
  lookingFor: string;
  message: string;
}

/** Institutional onboarding inquiry — stored as a raw document; anonymous create. */
export function saveInstitutionInquiry(data: InstitutionInquiry) {
  return databases.createDocument(
    WAITLIST_DB_ID,
    INSTITUTION_COLLECTION_ID,
    ID.unique(),
    data
  );
}

export interface WaitlistEntry {
  fullName: string;
  email: string;
  role: WaitlistRole;
  city: string;
  consent: boolean;
  phone?: string;
  college?: string;
  yearOfStudy?: "first" | "second" | "third" | "fourth" | "postgrad";
  tracks?: string[];
  source?: "instagram" | "friend" | "college" | "other";
  /** Code assigned TO this signup — their shareable link is /waitlist?ref=<code> */
  referralCode?: string;
  /** Code of the person whose link this signup came through (set from ?ref=) */
  referredBy?: string;
}

/** Short human-shareable code, e.g. CF-K7QX2M. Uniqueness is enforced by
    the Appwrite unique index on referralCode; collisions retry on submit. */
export function generateReferralCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no lookalikes (I/L/1/O/0)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CF-${code}`;
}

export async function joinWaitlist(entry: WaitlistEntry, attempt = 0): Promise<ReturnType<typeof databases.createDocument>> {
  return databases
    .createDocument(WAITLIST_DB_ID, WAITLIST_COLLECTION_ID, ID.unique(), {
      ...entry,
      referralCode: generateReferralCode(),
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      // Unique-index collision on the generated code — retry with a new one.
      // (Email collisions surface the same way; the page checks for that.)
      if (attempt < 3 && msg.includes("referralCode")) {
        return joinWaitlist(entry, attempt + 1);
      }
      throw err;
    });
}

/** Credit a referrer: bump referralCount by 1 via secure server route. */
export async function creditReferrer(code: string): Promise<boolean> {
  const cleanCode = (code || "").trim().toUpperCase().slice(0, 16);
  if (!cleanCode) return false;
  try {
    const res = await fetch("/api/waitlist/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: cleanCode }),
    });
    if (!res.ok) {
      console.warn("creditReferrer request failed with status", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("creditReferrer network error:", err);
    return false;
  }
}
