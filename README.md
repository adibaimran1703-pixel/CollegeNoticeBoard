# College Notice Board — Campus Announcement Hub

A clean, modern, accessible, and responsive university notice board application consolidating scattered announcements (WhatsApp groups, departmental emails, physical pin boards) into a unified platform.

Built with **React, Next.js (App Router), TypeScript, and Tailwind CSS**.

---

## Features

- **Auth Page Isolation**: Dedicated, clean pre-login authentication view displaying only login/registration forms with inline field validation. Pre-login state never renders navigation bars or notice previews.
- **Role Presets & Quick Switch**: One-click demo buttons for Student (*Alex Chen*) and Administrator (*Dr. Sarah Jenkins*), plus a header role switcher for immediate feature testing.
- **Notice Lifecycle & CRUD**:
  - **Create**: Modal form with Title, Description, Content, Category, Department, Target Year, Target Audience, Expiry Date, and frontend image upload. Supports saving as Draft or direct Publishing.
  - **Edit**: Pre-filled modal for notice creators and administrators.
  - **Delete**: Accessible confirmation modal with cancel and delete actions.
  - **Expiry Status**: Notices display active days remaining or an Expired badge when past the deadline.
  - **Drafts**: Private drafts visible only to author under "My Drafts".
  - **Admin Pinning**: High-priority announcements float to the top of the campus feed with a 📌 badge.
- **Interactions**:
  - **Live Upvotes**: Toggle on/off, tracked per user.
  - **Bookmarks / Saved**: Persisted in `localStorage`, surfaced in "Saved Notices".
  - **Clipboard Sharing**: Direct link copy with instant visual toast confirmation.
  - **View Tracking**: Increments strictly on opening the "View Details" modal, never on component re-render.
- **Discovery**:
  - **Real-Time Search**: Matches notice title, summary, content, category, department, and creator.
  - **Category Pills**: *Academic, Events, Internships, Competitions, Clubs, General, All*.
  - **Advanced Filters Drawer**: Filter by Department, Target Year, Target Audience, Notice Status (Active vs. Expired), and Pinned Bulletins.
  - **Sorting**: *Latest, Oldest, Most Upvoted, Most Viewed, Expiring Soon*.
- **Campus Events & Calendar**:
  - Month-navigable interactive calendar highlighting days with events.
  - Detailed event cards with timings, venue, organizer, and RSVP registration toggle.
- **Campus Notification Center**:
  - Dropdown & full view with categorization for upvotes, new placement alerts, event reminders, and expiry notices.
  - Mark individual notifications as read or mark all as read.
- **Profile & My Notices**:
  - User identity card with department, year, and aggregate metrics.
  - Sub-tabs for "My Notices", "Saved Notices", and "My Drafts".
- **Administrator Dashboard**:
  - Protected governance view for Admin accounts.
  - Metric cards: Total Notices, Active vs. Expired, Pinned Bulletins, Total Upvotes, Total Views, Campus Users.
  - Distribution breakdown by category and Most Viewed announcements table.
  - Moderation table with instant Pin/Unpin and Delete controls.

---

## Project Structure

```
CollegeNoticeBoard/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── .gitignore
├── README.md
└── src/
    ├── app/
    │   ├── layout.tsx              # Root HTML layout with context providers
    │   ├── page.tsx                # Dynamic switcher between Auth & Shell
    │   └── globals.css             # Tailwind base & utilities
    ├── types/
    │   └── index.ts                # TypeScript interfaces (Notice, User, Event, etc.)
    ├── data/
    │   ├── users.ts                # Pre-seeded student and admin mock accounts
    │   ├── notices.ts              # Campus notices across departments
    │   ├── events.ts               # Campus calendar events
    │   └── notifications.ts        # Mock notification alerts
    ├── services/
    │   ├── noticeService.ts        # Notice CRUD, votes, saves, view counts, pin toggling
    │   ├── eventService.ts         # Event listing, details, RSVP toggle
    │   ├── notificationService.ts  # Notification retrieval & read status
    │   └── userService.ts          # Session user and profile management
    ├── context/
    │   ├── AuthContext.tsx         # Auth state, login/signup/logout, role presets
    │   ├── NoticeContext.tsx       # Notice feed state, filters, modal management
    │   └── ToastContext.tsx        # Toast alert dispatcher
    ├── components/
    │   ├── auth/
    │   │   └── AuthPage.tsx        # Isolated login and registration view
    │   ├── layout/
    │   │   ├── Navbar.tsx          # Top bar with search, create button, alerts, avatar
    │   │   ├── Sidebar.tsx         # Desktop navigation sidebar
    │   │   └── MobileNav.tsx       # Mobile navigation drawer and bottom bar
    │   ├── notices/
    │   │   ├── NoticeCard.tsx      # Announcement card with tags, upvotes, bookmarks
    │   │   ├── NoticeList.tsx      # Grid view, loading skeletons, empty states
    │   │   ├── NoticeFormModal.tsx # Notice composer (Create/Edit, Draft/Publish)
    │   │   ├── NoticeDetailsModal.tsx # Full detail modal with view incrementing
    │   │   ├── CategoryFilter.tsx  # Horizontal category filter pills
    │   │   ├── AdvancedFilters.tsx # Collapsible filter drawer
    │   │   ├── SortDropdown.tsx    # Feed sorting dropdown
    │   │   ├── TrendingSection.tsx # "🔥 Trending This Week" ranked list
    │   │   └── PinnedNotices.tsx   # Top pinned bulletins showcase
    │   ├── events/
    │   │   ├── EventCalendar.tsx   # Month calendar with date selection
    │   │   ├── EventCard.tsx       # Event schedule card with RSVP
    │   │   ├── EventDetailsModal.tsx # Full event modal
    │   │   └── EventsView.tsx      # Integrated events view
    │   ├── notifications/
    │   │   ├── NotificationItem.tsx # Notification row with category styling
    │   │   ├── NotificationDropdown.tsx # Navbar flyout
    │   │   └── NotificationsView.tsx # Dedicated notifications page
    │   ├── profile/
    │   │   └── ProfileView.tsx     # Profile view with My Notices, Saved, Drafts
    │   ├── admin/
    │   │   └── AdminDashboard.tsx  # Admin statistics, category charts, governance
    │   └── common/
    │       ├── ImageUploader.tsx   # Client-side image selector & preview
    │       ├── DeleteConfirmation.tsx # Accessible modal confirmation
    │       ├── Skeletons.tsx       # Shimmer loading placeholders
    │       ├── EmptyState.tsx      # Contextual empty state illustrations
    │       ├── ErrorState.tsx      # Error fallback with retry action
    │       └── UserAvatar.tsx      # Avatar with initials fallback & role badge
    └── utils/
        └── formatters.ts           # Date formatting, relative time, expiry calculations
```

---

## How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Mock Data & Storage Model

All client state is initialized from structured datasets in `src/data/` and persisted to the browser's `localStorage`:
- `college_notice_board_notices_v1`: Stores created, updated, and deleted announcements.
- `college_notice_board_user_votes_v1`: Stores user upvote mappings.
- `college_notice_board_user_saved_v1`: Stores user bookmark IDs.
- `college_notice_board_events_v1`: Stores events and RSVP attendees.
- `college_notice_board_notifications_v1`: Stores alert items and read statuses.
- `college_notice_board_auth_status_v1`: Stores current session authentication status.

---

## How Supabase Would Later Be Connected

The entire application communicates with mock state via a decoupled **Service Layer** (`src/services/`):

```typescript
// Example: src/services/noticeService.ts
export const noticeService = {
  async getNotices(filters?: Partial<NoticeFilters>): Promise<{ data: Notice[]; error: string | null }> {
    // Current mock implementation reads from localStorage / seed data
    // Later replacement with Supabase client:
    /*
    let query = supabase.from('notices').select('*, creator:profiles(*)');
    if (filters?.category && filters.category !== 'All') query = query.eq('category', filters.category);
    if (filters?.department && filters.department !== 'All Departments') query = query.eq('department', filters.department);
    const { data, error } = await query;
    return { data: data || [], error: error?.message || null };
    */
  }
};
```

Because all UI components consume data exclusively through the `NoticeContext` and service functions, swapping in `@supabase/supabase-js` requires **zero changes to any React components or pages**.
