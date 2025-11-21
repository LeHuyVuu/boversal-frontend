# Project Structure

This project follows Next.js 13+ App Router best practices with a clean, scalable architecture.

## 📁 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── workspace/               # Workspace feature module
│       ├── layout.tsx           # Workspace layout
│       ├── page.tsx             # Workspace home
│       ├── dashboard/           # Dashboard route
│       ├── projects/            # Projects route
│       ├── issues/              # Issues route
│       ├── calendar/            # Calendar route
│       ├── meetings/            # Meetings route
│       ├── storage/             # Storage route
│       ├── documents/           # Documents route
│       ├── project/[id]/        # Dynamic project detail route
│       └── components/          # Workspace-specific components
│           ├── Dashboard.tsx
│           ├── Projects.tsx
│           ├── Issues.tsx
│           ├── Calendar.tsx
│           ├── KanbanBoard.tsx
│           ├── TaskCard.tsx
│           ├── TaskDetail.tsx
│           ├── ProjectDetail.tsx
│           ├── Sidebar.tsx
│           ├── TopBar.tsx
│           ├── Meetings.tsx
│           ├── Storage.tsx
│           └── Documents.tsx
│
├── components/                   # Shared/reusable components
│   ├── ui/                      # UI primitives (future)
│   └── common/                  # Common components (future)
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                 # Central export point
│   ├── user.ts                  # User types
│   ├── project.ts               # Project types
│   ├── task.ts                  # Task types
│   ├── issue.ts                 # Issue types
│   ├── team.ts                  # Team types
│   ├── profile.ts               # Profile types
│   ├── comment.ts               # Comment types
│   ├── calendar.ts              # Calendar event types
│   └── advertisement.ts         # Advertisement types
│
├── mocks/                        # Mock data for development
│   ├── index.ts                 # Central export point
│   ├── mockTasks.json
│   ├── mockProjects.json
│   ├── mockIssues.json
│   ├── mockUsers.json
│   ├── mockCalendarEvents.json
│   ├── dashboardStats.json
│   ├── teams.json
│   ├── profile.json
│   └── advertisement.json
│
└── lib/                          # Utility functions & constants
    ├── utils.ts                 # Helper functions
    └── constants.ts             # App constants

public/                           # Static assets
```

## 🎯 Key Principles

### 1. **Separation of Concerns**
- **Types**: Global TypeScript definitions in `src/types/`
- **Mocks**: Test/development data in `src/mocks/`
- **Utils**: Helper functions in `src/lib/`
- **Components**: UI components separated by scope (shared vs feature-specific)

### 2. **Import Conventions**

```typescript
// ✅ Good - Using centralized exports
import { User, Project, Task } from '@/types';
import { mockProjects, mockTasks } from '@/mocks';
import { formatDate, getStatusColor } from '@/lib/utils';

// ❌ Avoid - Direct file imports
import { User } from '@/types/user';
import mockProjects from '@/mocks/mockProjects.json';
```

### 3. **Component Organization**

- **Workspace-specific components**: `app/workspace/components/`
  - Only used within workspace routes
  - Can import from workspace context

- **Shared components**: `src/components/`
  - Reusable across different features
  - Should not depend on feature-specific logic

### 4. **File Naming**

- **Components**: PascalCase (e.g., `Dashboard.tsx`, `TaskCard.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Utils**: camelCase (e.g., `utils.ts`, `constants.ts`)
- **Types**: camelCase (e.g., `user.ts`, `project.ts`)

### 5. **Type Safety**

All types are centrally defined and exported from `src/types/index.ts`:

```typescript
export type { User, Manager } from './user';
export type { Project } from './project';
export type { Task } from './task';
// ... etc
```

## 🚀 Benefits

1. **Scalability**: Easy to add new features without cluttering
2. **Maintainability**: Clear separation makes code easier to maintain
3. **Reusability**: Shared utilities and types reduce duplication
4. **Developer Experience**: Consistent patterns and imports
5. **Type Safety**: Centralized type definitions

## 📝 Adding New Features

### Adding a new route:
```bash
src/app/workspace/new-feature/
├── page.tsx
└── components/ (if needed)
```

### Adding new types:
1. Create `src/types/new-type.ts`
2. Export from `src/types/index.ts`

### Adding new mock data:
1. Create `src/mocks/new-data.json`
2. Export from `src/mocks/index.ts`

### Adding utilities:
Add to `src/lib/utils.ts` or create new utility files in `src/lib/`
