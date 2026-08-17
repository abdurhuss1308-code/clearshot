# Clearshot

Turn every screenshot into a one-tap action card.

Clearshot transforms your screenshot backlog into sorted, actionable cards. Upload dozens at once, let AI read them, and clear your queue with single taps—buy it, call it, calendar it, or file it


## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to get started.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + React Router
- **Authentication:** Local (Phase 1) → Lovable Cloud (Phase 2+)
- **Database:** localStorage (Phase 1) → Postgres via Lovable Cloud (Phase 2+)
- **AI:** Lovable's built-in AI connector with vision capabilities
- **Storage:** Lovable Cloud's private file storage

## Architecture

### Phase 1: Foundation ✓
- Auth system (email/password, magic links)
- Database schema with RLS
- Custom design system (warm neutrals, deep teal accent)
- App shell with navigation and settings
- Landing, signup, login, queue, archive, and settings pages

### Phase 2: Ingestion + AI (Coming next)
- Screenshot upload (drag-drop, paste, multi-select)
- Bulk processing with live progress
- Edge function for categorization using Lovable's AI connector
- Queue page with card rendering and filtering

### Phase 3: Card Actions (Coming after Phase 2)
- Category-specific action buttons
- Card detail view with editable fields
- Animated card completion/dismissal
- Sensitive data handling (blur thumbnails, delete on demand)

### Phase 4: Archive + Polish (Coming after Phase 3)
- Archive page with search and restore
- Onboarding flow for new users
- Responsive mobile polish
- Edge case handling

## File Structure

```
src/
├── components/        # Reusable components (Navigation, Cards, etc.)
├── contexts/          # React Context (Auth, Cards)
├── pages/             # Page components (Landing, Queue, Archive, Settings)
│   ├── Auth/          # Auth pages (Signup, Login)
│   └── ...
├── types/             # TypeScript types and interfaces
├── App.tsx            # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Color System

- **Backgrounds:** Off-white (`#faf8f6`)
- **Text:** Warm charcoal (`#2a2620`)
- **Accents:** Deep teal (`#24d4ce` → `#167575` for darker)
- **Category tags:** Amber (shopping), Sky (travel), Violet (contact), Rose (note), Emerald (task), Slate (other)

## Design Philosophy

Clearshot's UI is calm, clear, and quietly confident—the visual opposite of a cluttered camera roll. We emphasize the relief of an empty queue and the satisfaction of clearing your backlog, not [...]
