# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Xone-dev is a **trading portfolio management application** built with **Angular + Tauri** architecture. The frontend is a modern Angular 20 SPA with Bootstrap styling, and the backend is a Rust-based Tauri application that connects to a SurrealDB database for data persistence.

### Architecture

- **Frontend**: Angular 20 with TypeScript, Bootstrap 5, Chart.js for visualization
- **Backend**: Rust with Tauri 2.0 framework 
- **Database**: SurrealDB (local WebSocket connection on port 8000)
- **Desktop App**: Cross-platform desktop application via Tauri
- **Communication**: Tauri IPC commands for frontend-backend communication

## Core Domain Models

The application manages two primary entities:
- **Categories**: Trading categories (stocks, crypto, etc.) 
- **Trades**: Individual trade records with profit/loss tracking

Data flows from SurrealDB → Rust Tauri commands → Angular services → Components.

## Development Commands

### Setup & Dependencies
```bash
# Install frontend dependencies
npm install

# Install Tauri CLI (if not installed)
cargo install tauri-cli
```

### Development Server
```bash
# Start Angular dev server + Tauri dev app (recommended)
npm run tauri dev

# Or start Angular dev server only (for frontend-only development)
npm start
# Then in another terminal:
npm run tauri dev --no-dev-server
```

### Building
```bash
# Build Angular frontend
npm run build

# Build Tauri app for distribution
npm run tauri build

# Watch mode for frontend development
npm run watch
```

### Database
The application expects SurrealDB running on `127.0.0.1:8000` with:
- Namespace: `eric`
- Database: `Trading` 
- Auth: root/root (development only)

Start SurrealDB:
```bash
surreal start --log trace --user root --pass root memory
```

### Code Quality
```bash
# Check Rust code
cd src-tauri && cargo check

# Fix Rust warnings
cd src-tauri && cargo fix

# Format Rust code  
cd src-tauri && cargo fmt

# Angular lint (using Angular CLI)
npm run ng lint
```

## Project Structure

### Frontend (`src/app/`)
- `models/` - TypeScript interfaces for Category, Trade, SurrealId
- `services/` - Angular services for API communication (`trade.service.ts`, `category.service.ts`)
- `pipes/` - Custom pipes (`filter-trades.pipe.ts`)
- Component structure: `home/`, `trade/`, `category/`, `about/`, `navbar/`, `banner/`

### Backend (`src-tauri/src/`)
- `main.rs` - Application entry point
- `lib.rs` - Tauri app setup, command handlers, database injection  
- `db.rs` - SurrealDB connection, data access commands (`get_types`, `get_trades`)
- `category.rs` - Category management commands (`create_category`, `update_type`, `delete_category`)
- `model.rs` - Rust structs for Category and Trade

### Key Integration Points
- Tauri commands are defined in `src-tauri/src/lib.rs` invoke_handler
- Frontend calls backend via `invoke()` from `@tauri-apps/api/core`
- All database operations are async and use Arc<Mutex<Surreal<Client>>> for thread safety

## Development Guidelines

Follow the established patterns in `PROMPT_RULES.md`:
- Maintain readability over cleverness
- Only modify what is necessary  
- Keep functions focused and single-purpose
- Write tests for new functionality
- Handle errors explicitly
- Follow existing code style and formatting

## Data Flow Architecture

1. **SurrealDB** stores Categories and Trades
2. **Rust Tauri Commands** handle database queries with proper error handling
3. **Angular Services** invoke Tauri commands and manage state
4. **Angular Components** consume services and handle UI logic
5. **Bootstrap + Chart.js** provide styling and data visualization

The application uses Tauri's state management to share the database connection across commands, ensuring efficient resource usage.