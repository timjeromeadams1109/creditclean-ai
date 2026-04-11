/**
 * Tests for GET/POST /api/items (src/app/api/items/route.ts)
 * Mocked: next-auth session, Supabase
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));

import { getServerSession } from "next-auth";
import { getServiceSupabase } from "@/lib/supabase";
import { GET, POST } from "@/app/api/items/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetServiceSupabase = vi.mocked(getServiceSupabase);

const USER_SESSION = {
  user: { id: "user-123", email: "user@test.com", name: "Test User", role: "user" },
};

function makeGetRequest(params: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/items");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new Request(url.toString(), { method: "GET" });
}

function makePostRequest(body: unknown) {
  return new Request("http://localhost:3000/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function buildQueryChain(data: unknown, error: unknown = null) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data, error }),
    insert: vi.fn().mockReturnThis(),
  };
  // For POST — insert().select()
  chain.insert.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data, error }),
  });
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NODE_ENV = "development";
});

// ── GET /api/items ────────────────────────────────────────────────────

describe("GET /api/items — Auth guard", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await GET(makeGetRequest() as never);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });
});

describe("GET /api/items — Authenticated", () => {
  it("returns 200 with items array on success", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    const mockItems = [{ id: "item-1", creditor_name: "Acme" }];
    const chain = buildQueryChain(mockItems);
    mockGetServiceSupabase.mockReturnValue({ from: vi.fn().mockReturnValue(chain) } as never);
    const res = await GET(makeGetRequest() as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toEqual(mockItems);
  });

  it("returns 500 when database query fails", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    const chain = buildQueryChain(null, { message: "DB error" });
    mockGetServiceSupabase.mockReturnValue({ from: vi.fn().mockReturnValue(chain) } as never);
    const res = await GET(makeGetRequest() as never);
    expect(res.status).toBe(500);
  });

  it("does NOT return items belonging to other users", async () => {
    // The route scopes by user_id — we verify eq() is called with the session userId
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    let capturedUserId: string | undefined;
    const eqSpy = vi.fn().mockImplementation((_col: string, val: string) => {
      if (_col === "user_id") capturedUserId = val;
      return { order: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });
    mockGetServiceSupabase.mockReturnValue({
      from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: eqSpy }) }),
    } as never);
    await GET(makeGetRequest() as never);
    expect(capturedUserId).toBe("user-123");
  });
});

// ── POST /api/items ───────────────────────────────────────────────────

describe("POST /api/items — Auth guard", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await POST(makePostRequest({
      bureaus: "equifax", item_type: "collection", creditor_name: "Test",
    }) as never);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/items — Input validation", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
  });

  it("returns 400 when bureaus is missing", async () => {
    const res = await POST(makePostRequest({
      item_type: "collection", creditor_name: "Test",
    }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when creditor_name is missing", async () => {
    const res = await POST(makePostRequest({
      bureaus: "equifax", item_type: "collection",
    }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 for completely invalid body", async () => {
    const req = new Request("http://localhost:3000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
      body: "not-json",
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/items — Successful creation", () => {
  it("returns 201 and creates items when input is valid", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    const createdItems = [{ id: "new-item-1", bureau: "equifax", creditor_name: "Acme" }];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: createdItems, error: null }),
        }),
      }),
    };
    mockGetServiceSupabase.mockReturnValue(mockSupabase as never);
    const res = await POST(makePostRequest({
      bureaus: "equifax", item_type: "collection", creditor_name: "Acme",
    }) as never);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.items).toEqual(createdItems);
  });

  it("creates one item per bureau when bureaus is an array", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    let capturedRecords: unknown[] = [];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation((records: unknown[]) => {
          capturedRecords = records;
          return { select: vi.fn().mockResolvedValue({ data: records, error: null }) };
        }),
      }),
    };
    mockGetServiceSupabase.mockReturnValue(mockSupabase as never);
    await POST(makePostRequest({
      bureaus: ["equifax", "experian", "transunion"],
      item_type: "late_payment",
      creditor_name: "Bank of America",
    }) as never);
    expect(capturedRecords).toHaveLength(3);
  });
});
