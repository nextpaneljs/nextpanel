# Authentication

NextPanel uses [Better Auth](https://better-auth.com) for authentication. It comes pre-configured with email/password login, session management, and route protection.

## Overview

- **Login page** at `/login`
- **Register page** at `/register`
- **Admin panel** at `/admin/*` — protected, redirects to login if not authenticated
- **Sessions** stored in the database via Prisma
- **Middleware** protects all `/admin/*` routes

## How It Works

### 1. Server Config (`src/lib/auth.ts`)

The Better Auth server instance is configured with the Prisma adapter:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",  // Change to "postgresql" for production
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Refresh session daily
  },
});
```

### 2. Client Config (`src/lib/auth-client.ts`)

The client-side auth hooks for React components:

```typescript
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

Use `authClient` in client components for sign in, sign up, and sign out.

### 3. API Route (`src/app/api/auth/[...all]/route.ts`)

Better Auth's catch-all API handler:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 4. Middleware (`src/middleware.ts`)

Protects `/admin/*` routes by checking for a session cookie:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

### 5. Admin Layout Session Check

The admin layout also validates the session server-side and redirects if invalid:

```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});
if (!session) redirect("/login");
```

## Environment Variables

```env
BETTER_AUTH_SECRET="your-secret-key"    # Required: Session encryption key
BETTER_AUTH_URL="http://localhost:3000"  # Required: Your app URL
```

## Database Tables

Better Auth requires these tables (included in the Prisma schema):

- **User** — `id`, `name`, `email`, `emailVerified`, `image`, timestamps
- **Session** — `id`, `token`, `expiresAt`, `userId`, `ipAddress`, `userAgent`
- **Account** — `id`, `accountId`, `providerId`, `userId`, tokens, `password`
- **Verification** — `id`, `identifier`, `value`, `expiresAt`

## Server Action Protection

All CRUD server actions validate the session before executing:

```typescript
async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");
  return session;
}
```

This means even if someone bypasses the middleware, the server actions will reject unauthenticated requests.

## Switching to PostgreSQL (Neon)

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `src/lib/auth.ts`:
   ```typescript
   provider: "postgresql",
   ```

3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

4. Run migrations:
   ```bash
   npx prisma db push
   ```

## Adding OAuth Providers

Better Auth supports OAuth. To add Google login:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ...existing config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

See the [Better Auth docs](https://better-auth.com/docs) for more providers and options.
