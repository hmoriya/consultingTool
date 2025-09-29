# Consulting Dashboard

A comprehensive project management dashboard for consulting firms with role-based access control.

## Features

### Role-Based Dashboards

#### Executive Dashboard (`/dashboard/executive`)
- Portfolio overview with project status distribution
- Revenue and profitability analysis
- Resource utilization and optimization views
- Key performance metrics

#### PM Dashboard (`/dashboard/pm`)
- Project management interface
- Task and milestone tracking
- Team utilization monitoring
- Risk identification and mitigation

#### Consultant Dashboard (`/dashboard/consultant`)
- Personal task management
- Weekly calendar view
- Project assignments
- Skills and expertise tracking

#### Client Portal (`/dashboard/client`)
- Project progress monitoring
- Document access
- Activity timeline
- Budget and timeline tracking

### Core Features
- **Authentication**: Secure login with role-based redirects
- **Project Management**: Create, update, and track projects
- **Team Management**: Manage consultants and their skills
- **Client Management**: Track client organizations and contacts
- **Task Tracking**: Comprehensive task management with status updates
- **Document Management**: Project document storage and access control

## Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom implementation with bcrypt
- **Validation**: Zod schemas
- **Forms**: React Hook Form

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/hmoriya/consultingTool.git

# Navigate to the project
cd consultingTool/consulting-dashboard-new

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up Git hooks (自動DBリセット機能を有効化)
./scripts/setup-git-hooks.sh

# Set up the database
npm run db:reset

# Start the development server
npm run dev
```

### 自動DBリセット機能

このプロジェクトでは、`git pull`や`git merge`を実行すると、自動的にサンプルデータベースが最新の状態にリセットされます。

- **自動リセットを有効化**: `./scripts/setup-git-hooks.sh`
- **手動でリセット**: `npm run db:reset`
- **DBクリア付きシード**: `npm run db:seed:clear`

詳細は[README-seed.md](./README-seed.md)を参照してください。

The application will be available at [http://localhost:3000](http://localhost:3000)

### Test Credentials

```
Executive: exec@example.com / password123
PM: pm@example.com / password123
Consultant: consultant@example.com / password123
Client: client@example.com / password123
```

## Project Structure

```
consulting-dashboard-new/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layout
│   ├── dashboard/         # Role-specific dashboards
│   ├── projects/          # Project management
│   ├── clients/           # Client management
│   ├── team/              # Team management
│   ├── actions/           # Server actions
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utilities and configs
│   └── types/            # TypeScript types
├── design/               # Design documents
├── prisma/              # Database schema
└── public/             # Static assets
```

## Development

### Database Commands

```bash
# Push schema changes
npm run db:push

# Seed the database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Design Documents

Comprehensive design documentation is available in the `/design` directory:
- Database schema
- API specifications
- Use case diagrams
- UI/UX wireframes
- Test specifications

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

[Your License Here]
