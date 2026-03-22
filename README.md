# NextPanel

A Filament-inspired admin panel framework for Next.js. Build full-featured admin panels with CRUD resources, data tables, forms, and authentication — all from simple configuration objects.

## What It Solves

Building admin panels in Next.js is repetitive. For every database model, you need to:

- Create list, create, and edit pages
- Build data tables with sorting, filtering, pagination
- Build forms with validation
- Wire up server actions for CRUD operations
- Add navigation entries
- Protect routes with authentication

**NextPanel eliminates this repetition.** Define a resource config once, and the framework generates everything — pages, tables, forms, validation, navigation, and server actions.

Inspired by [Laravel Filament](https://filamentphp.com), but built for the Next.js ecosystem.

## Tech Stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **Prisma** (ORM with SQLite for development, PostgreSQL/Neon for production)
- **Better Auth** (Authentication with email/password)
- **shadcn/ui v4** (UI components)
- **TanStack Table** (Data tables)
- **React Hook Form + Zod** (Form handling and validation)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp packages/app/.env.example packages/app/.env
# Edit .env with your database URL

# 3. Generate Prisma client and create database
cd packages/app
npx prisma generate
npx prisma db push

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to the login page. Register an account to access the admin panel.

## Using the CLI

The CLI follows the Next.js ecosystem convention — use `npx nextpanel add`:

```bash
# Generate a resource from an existing Prisma model
npx nextpanel add resource Post --from-model

# Generate with custom icon and nav group
npx nextpanel add resource Category --from-model --icon Tag --group Content

# Add a new model to Prisma schema (interactive)
npx nextpanel add model Product
```

## Project Structure

```
nextpanel/
├── packages/
│   ├── app/                    # Next.js admin panel
│   │   ├── prisma/             # Database schema
│   │   └── src/
│   │       ├── app/            # Next.js routes
│   │       │   ├── (auth)/     # Login & register pages
│   │       │   ├── admin/      # Admin panel pages
│   │       │   └── api/        # API routes (auth)
│   │       ├── nextpanel/     # Core framework
│   │       │   ├── actions/    # CRUD server actions
│   │       │   ├── form/       # Form builder components
│   │       │   ├── layout/     # Admin shell (sidebar, topbar)
│   │       │   ├── pages/      # Generic resource pages
│   │       │   ├── table/      # Table builder components
│   │       │   └── types.ts    # TypeScript interfaces
│   │       └── resources/      # Resource configurations
│   └── cli/                    # CLI tool
│       ├── src/
│       │   ├── commands/       # CLI commands
│       │   ├── prisma/         # Schema parser & field mapper
│       │   └── templates/      # Handlebars templates
│       └── templates/          # Page templates (.hbs)
```

## Documentation

- [Resources](docs/resources.md) — How to define and customize resources
- [Tables](docs/tables.md) — Table columns, filters, sorting, and pagination
- [Forms](docs/forms.md) — Form fields, validation, and layouts
- [Authentication](docs/authentication.md) — Auth setup and configuration
- [CLI](docs/cli.md) — CLI commands and usage

## License

MIT
