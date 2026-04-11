/**
 * Tests for GET/POST /api/scores (src/app/api/scores/route.ts)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));

import { getServerSession } from "next-auth";
import { getServiceSupabase } from "@/lib/supabase";
import { GET, POST } from "@/app/api/scores/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetServiceSupabase = vi.mocked(getServiceSupabase);

const USER_SESSION = { user: { id: "user-99", email: "user@test.com", role: "user" } };

function makeGetReq(bureau?: string) {
  const url = new URL("http://localhost:3000/api/scores");
  if (bureau) url.searchParams.set("bureau", bureau);
  return new Request(url.toString());
}

function makePostReq(body: unknown) {
  return new Request("http://localhost:3000/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NODE_ENV = "development";
});

// ── GET ────────────────────────────────────────────────────────────────

describe("GET /api/scores", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(401);
  });

  it("returns 200 with scores for authenticated user", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    const scores = [{ id: "s1", score: 720, bureau: "equifax" }];
    mockGetServiceSupabase.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: scores, error: null }),
      }),
    } as never);
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.scores).toEqual(scores);
  });
});

// ── POST ───────────────────────────────────────────────────────────────

describe("POST /api/scores — Validation", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
  });

  it("returns 400 for score below 300", async () => {
    const res = await POST(makePostReq({ bureau: "equifax", score: 100 }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 for score above 850", async () => {
    const res = await POST(makePostReq({ bureau: "equifax", score: 999 }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing bureau", async () => {
    const res = await POST(makePostReq({ score: 720 }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 201 for valid score input", async () => {
    const inserted = { id: "score-1", score: 720, bureau: "equifax" };
    mockGetServiceSupabase.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: inserted, error: null }),
      }),
    } as never);
    const res = await POST(makePostReq({ bureau: "equifax", score: 720 }) as never);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.score).toEqual(inserted);
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await POST(makePostReq({ bureau: "equifax", score: 720 }) as never);
    expect(res.status).toBe(401);
  });
});
