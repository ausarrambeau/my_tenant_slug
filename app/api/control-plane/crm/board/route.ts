import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredEnv(name: string) {
  const value = asString(process.env[name]);
  if (!value) {
    throw new Error(`Missing required environment variable ${name}.`);
  }
  return value;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function parsePositiveInt(value: unknown, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function mintControlPlaneProxyJwt(input: { tenantSlug: string; secret: string; ttlSeconds: number }) {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      tenant_slug: input.tenantSlug,
      iat: now,
      exp: now + input.ttlSeconds,
    })
  );
  const signature = createHmac("sha256", input.secret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const baseUrl = requiredEnv("CONTROL_PLANE_BASE_URL").replace(/\/$/, "");
    const signingSecret = requiredEnv("CONTROL_PLANE_PROXY_SIGNING_SECRET");
    const tenantSlug = requiredEnv("CONTROL_PLANE_TENANT_SLUG");
    const defaultClientId = asString(process.env.CONTROL_PLANE_CLIENT_ID);
    const ttlSeconds = parsePositiveInt(process.env.CONTROL_PLANE_PROXY_TOKEN_TTL_SECONDS, 60);
    const authorizationToken = mintControlPlaneProxyJwt({
      tenantSlug,
      secret: signingSecret,
      ttlSeconds,
    });

    const requestUrl = new URL(req.url);
    const limit = Math.max(1, Math.min(250, Number(requestUrl.searchParams.get("limit") || 50)));
    const clientId = asString(requestUrl.searchParams.get("client_id")) || defaultClientId;

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (clientId) {
      params.set("client_id", clientId);
    }

    const upstream = await fetch(`${baseUrl}/api/agency/proxy/crm/board?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        authorization: `Bearer ${authorizationToken}`,
      },
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: asString((payload as any)?.error) || "Control-plane board request failed.",
          code: asString((payload as any)?.code) || "control_plane_error",
        },
        { status: upstream.status || 502 }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unable to load control-plane board data.",
        code: "proxy_error",
      },
      { status: 500 }
    );
  }
}
