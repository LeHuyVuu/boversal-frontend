# Boversal Frontend

A modern workspace management application built with Next.js 15, React 19, and TypeScript.

## Features

- 📊 **Dashboard**: Real-time statistics and overview
- 📁 **Projects**: Project management with status tracking
- ✅ **Tasks**: Kanban board with drag-and-drop functionality
- 🐛 **Issues**: Issue tracking and resolution
- 📅 **Calendar**: Event scheduling and management
- 💾 **Storage**: Document management
- 👥 **Meetings**: Meeting coordination
- 📄 **Documents**: Document organization

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **UI**: React 19.1.0 + TailwindCSS 4.0
- **Language**: TypeScript 5.x (strict mode)
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── workspace/        # Main workspace routes
│   │   ├── components/   # Workspace-specific components
│   │   ├── dashboard/    # Dashboard page
│   │   ├── projects/     # Projects page
│   │   ├── calendar/     # Calendar page
│   │   └── ...
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── types/                # TypeScript type definitions
├── mocks/                # Mock data for development
└── lib/                  # Utilities and constants
    ├── utils.ts          # Helper functions
    └── constants.ts      # API endpoints
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

See `.env.example` for required environment variables.

## API Integration

API endpoints are centralized in `src/lib/constants.ts`:
- Base URL: `https://foundershub.nducky.id.vn/api`
- Endpoints: projects, tasks, issues, users

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run type-check` and `npm run lint`
4. Submit a pull request

## License

Private project - All rights reserved
