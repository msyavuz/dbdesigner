# DB Designer

A modern visual database design application built with Bun, Hono, Vite, and React. Create, visualize, and manage your database schemas however you want using an intuitive drag-and-drop interface or chat with AI (or both).

## Features

- **Visual Database Design**: Design your database schemas using an interactive visual workbench
- **Table Management**: Create, edit, and manage database tables with columns and relationships  
- **Relationship Modeling**: Define foreign key relationships between tables with visual connections
- **Project Organization**: Organize your database designs into separate projects
- **AI Integration**: Get AI assistance for database design decisions
- **Authentication**: Secure user authentication and project management
- **Dark/Light Theme**: Choose between dark and light mode interfaces

### Planned
- **Collaboration**: Real-time collaboration features for multiple users
- **Export Options**: Export your designs in various formats

## Tech Stack

### Frontend (Client)
- **React 19** with TypeScript for the user interface
- **Vite** for fast development and building
- **TanStack Router** for routing and navigation
- **React Flow** for the visual workbench and node-based editing
- **Radix UI** components for accessible UI primitives
- **Tailwind CSS** for styling and responsive design
- **React Hook Form** with Zod validation

### Backend (Server)
- **Bun** runtime for high-performance JavaScript execution
- **Hono** web framework for building APIs
- **Drizzle ORM** for type-safe database operations
- **SQLite** database for data persistence
- **Better Auth** for authentication and session management
- **OpenAI** integration for AI-powered features

### Shared
- **Zod** schemas for type validation across client and server
- **TypeScript** for end-to-end type safety

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Node.js (for package compatibility)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/msyavuz/dbdesigner.git
cd dbdesigner
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
cd server
bun run schema:db
```

4. Start the development servers:
```bash
# From the root directory
bun run dev
```

This will start:
- Client development server at `http://localhost:5173`
- Server API at `http://localhost:3000`
- Shared package in watch mode

### Building for Production

```bash
bun run build
```

## Project Structure

```
dbdesigner/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── routes/      # TanStack Router routes
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
│   └── package.json
├── server/          # Hono backend API
│   ├── src/
│   │   ├── routers/     # API route handlers
│   │   ├── db/          # Database schemas and types
│   │   ├── lib/         # Server utilities
│   │   └── middlewares/ # Express-like middlewares
│   └── package.json
├── shared/          # Shared types and schemas
│   └── src/
│       ├── schemas/     # Zod validation schemas
│       ├── types/       # TypeScript type definitions
│       └── utils/       # Shared utility functions
└── package.json     # Root package.json with workspace scripts
```

## Development

### Available Scripts

- `bun run dev` - Start all development servers
- `bun run dev:client` - Start only the client dev server
- `bun run dev:server` - Start only the server dev server
- `bun run build` - Build all packages for production
- `bun run lint` - Run ESLint on the client code

### Database Management

The application uses Drizzle ORM with SQLite. Database schema changes are managed through migrations:

```bash
cd server
bun run schema:db  # Generate and run migrations
```

## Usage

1. **Create a Project**: Start by creating a new database design project
2. **Design Tables**: Use the visual workbench to create tables and define columns
3. **Add Relationships**: Connect tables by dragging between column handles
4. **Save Changes**: Use the save button to persist your design
5. **Export**: Export your completed design in your preferred format

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Mehmet Salih Yavuz** - [GitHub](https://github.com/msyavuz)
