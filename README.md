# Typeform Clone with tRPC, Next.js, and Tailwind CSS

A full-stack Typeform clone built with a Turborepo monorepo, featuring Next.js, tRPC, Tailwind CSS, TypeScript, and more.

## 🚀 Features

- **Monorepo Structure**: Powered by Turborepo for efficient builds and caching
- **Full TypeScript**: End-to-end type safety
- **tRPC**: Typesafe API communication between client and server
- **Next.js 13+**: App Router, Server Components, and React 18
- **Tailwind CSS**: Utility-first styling with custom design system
- **Form Builder**: Drag-and-drop form creation with various field types
- **Form Responses**: Collect and view form submissions
- **Authentication**: User signup, login, and session management
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Preview**: See form changes instantly as you build
- **Database**: PostgreSQL with Drizzle ORM
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Linting & Formatting**: ESLint and Prettier configured

## 📁 Project Structure

```
trpc-monorepo/
├── apps/
│   ├── api/          # Express.js API server with tRPC
│   └── web/          # Next.js web application
├── packages/
│   ├── database/     # Database schemas and Drizzle configuration
│   ├── eslint-config/ # Shared ESLint configurations
│   ├── logger/       # Logging utility
│   ├── services/     # Business logic services (user, form, etc.)
│   ├── trpc/         # tRPC router definitions and context
│   ├── typescript-config/ # Shared tsconfigs
│   └── ui/           # Shared React components (if any)
├── .env              # Environment variables
├── docker-compose.yml # Docker services (PostgreSQL, etc.)
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json with workspace scripts
```

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.1.0 (App Router)
- **API Layer**: [tRPC](https://trpc.io/) 11.8.1
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.1.18
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query) v5
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Monorepo Tool**: [Turborepo](https://turborepo.org/) 2.7.2
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/) 5.9.2
- **Linting**: [ESLint](https://eslint.org/) 9.39.1
- **Formatting**: [Prettier](https://prettier.io/) 3.7.4
- **Icons**: [Tabler Icons](https://tabler-icons.io/) via React
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.40.0
- **Date Handling**: [date-fns](https://date-fns.org/) 4.1.0
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) 2.0.7
- **API Reference**: [Scalar](https://scalar.com/) for OpenAPI docs

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- PostgreSQL (or use Docker compose)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd battlefield/typeform-trpc
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy the example environment files from each package (or create a `.env` at the root):
   ```bash
   cp packages/database/.env.example packages/database/.env
   cp packages/logger/.env.example packages/logger/.env
   cp packages/services/.env.example packages/services/.env
   cp packages/trpc/.env.example packages/trpc/.env
   cp packages/typescript-config/.env.example packages/typescript-config/.env
   ```
   Then adjust the values as needed (especially database connection string).

4. Start the development services:
   ```bash
   pnpm dev
   ```
   This will start:
   - Next.js web app on `http://localhost:3000`
   - API server on `http://localhost:4000` (proxy handled by Next.js in dev)

### Environment Variables

Key environment variables (see individual package `.env.example` files for details):

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing authentication tokens
- `NEXT_PUBLIC_API_URL`: URL of the API server (for client)
- `NEXT_PUBLIC_APP_URL`: URL of the web app

### Database Setup

1. Generate database client:
   ```bash
   pnpm db:generate
   ```

2. Run migrations:
   ```bash
   pnpm db:migrate
   ```

## 📜 Available Scripts

In the root `package.json`:

- `pnpm dev`: Start all apps in development mode
- `pnpm build`: Build all apps for production
- `pnpm start`: Start all apps in production mode
- `pnpm lint`: Run ESLint across the workspace
- `pnpm format`: Format code with Prettier
- `pnpm check-types`: Run TypeScript type checking
- `pnpm db:generate`: Generate Drizzle client
- `pnpm db:migrate`: Run database migrations

## 🐳 Docker Usage

The project includes a `docker-compose.yml` for easy setup:

```bash
docker-compose up -d
```

This will start PostgreSQL and other services defined in the compose file.

## 🧱 Architecture Overview

### Monorepo Boundaries

- **Apps**: Deployable applications (`web` and `api`)
- **Packages**: Shared libraries and configurations

### Key Packages

- `@repo/database`: Database connection, schemas, and models
- `@repo/logger`: Centralized logging utility
- `@repo/services`: Business logic layer (user service, form service, etc.)
- `@repo/trpc`: tRPC router definitions, context, and shared types
- `@repo/typescript-config`: Shared TypeScript configurations
- `@repo/eslint-config`: Shared ESLint configurations

### Data Flow

1. Client (Next.js) makes typesafe tRPC calls to API server
2. API server uses `@repo/services` for business logic
3. Services interact with `@repo/database` for data persistence
4. Responses are validated with Zod and returned to client
5. Client updates UI via TanStack Query cache

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow the existing code style and ensure all linting passes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Turborepo](https://turborepo.org/) for monorepo tooling
- [tRPC](https://trpc.io/) for typesafe APIs
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All other open-source libraries used in this project

---

Built with ❤️ by the development team.