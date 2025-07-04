# Next.js 15 Hacker News Top Stories Demo

A modern, production-grade demo app built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.  
It fetches and displays paginated Hacker News stories, with author details, comments, dark mode, robust testing, and strict code quality enforcement.

## 🌐 Live Demo

**Try it out:** [https://nextjs15-demo-alpha.vercel.app/](https://nextjs15-demo-alpha.vercel.app/)

---

## 🚀 Features

- **Next.js 15 App Router** with React Server Components (RSC) and Client Components
- **TypeScript** throughout for type safety
- **Tailwind CSS** for styling and dark mode (all styling via utility classes in `className`)
- **API proxying**: All HN API requests go through your Next.js backend
- **Pagination**: Browse stories with accessible, robust pagination controls
- **Link Previews**: Rich previews for story URLs (image, title, description, logo) using a pure JS Cheerio-based scraper
- **Client-side image handling**: All external images use a custom `ClientImage` (Next.js `<Image />` with custom loader, no domain restrictions)
- **Author details**: View karma and account creation date for each story's author
- **Comments system**: Full comment threads with lazy-loading nested comments and safe HTML rendering
- **Safe HTML rendering**: All user-generated content is sanitized with DOMPurify to prevent XSS attacks
- **Accessibility**: Keyboard navigation, ARIA labels, and semantic HTML
- **Testing**: Jest, React Testing Library, and code coverage
- **Prettier, ESLint, Husky, lint-staged**: Enforced code style and pre-commit checks
- **Scroll restoration**: When returning from story detail to the list, your scroll position is restored

---

## 🛠️ Setup Instructions

### 1. **Clone and Install**

```bash
git clone git@github.com:mickael-h/nextjs15-demo.git
cd nextjs15-demo
npm install
```

### 2. **Environment Variables**

Create a `.env.local` file in the project root with the following:

```env
# The base URL for the official Hacker News API (must end with a slash)
HN_API_URL=https://hacker-news.firebaseio.com/

# The public site URL for client-side fetches (no trailing slash)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `HN_API_URL` is used by server-side API routes to fetch HN data.
- `NEXT_PUBLIC_SITE_URL` is used by client-side code and hooks to call your own API endpoints.

### 3. **Run the App**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing, Linting & Type Checking

- **Run all tests:**
  ```bash
  npm test
  ```
- **Check code coverage:**
  ```bash
  npm test -- --coverage
  ```
- **Lint and format code:**
  ```bash
  npm run lint
  npm run format
  ```
- **Check type validity:**
  ```bash
  npm run typecheck
  ```

### Pre-commit Hook (Husky v10+)

- Husky and lint-staged are set up to run Prettier and ESLint on staged files before every commit.
- The `.husky/pre-commit` file contains the commands to run (no `husky.sh`):
  ```sh
  npx lint-staged
  npm run lint
  npm run typecheck
  npm test
  ```
- If you add new hooks, just add your commands directly to the relevant `.husky/*` file.

### Prettier Ignore

- The `.prettierignore` file ensures Prettier does **not** format:
  - `.next` (build output)
  - `node_modules` (dependencies)
  - All config files matching `*.config.*` (e.g., `next.config.js`, `tailwind.config.js`)
  - All files matching `*.rc` (e.g., `.eslintrc`, `.prettierrc`)

---

## 🏗️ Code Architecture & Decisions

### **Directory Structure**

- `src/app/` — Next.js App Router, API routes, pages, and layout
- `src/components/` — UI components (StoryList, StoryCard, StoryDetail, LinkPreview, ClientImage, Comment, CommentsList, etc.)
- `src/hooks/` — Custom React hooks (useAuthor, useComments, useNestedComments)
- `src/lib/` — Pure backend logic (for HN API fetchers, link preview scraping, easily unit tested)

### **API Proxying**

- All requests to the Hacker News API are proxied through `/api/hn/top20`, `/api/hn/user/[username]`, `/api/hn/comments/[storyId]`, `/api/hn/comments/nested`, and `/api/preview` routes.
- This enables error handling and lets you add business logic to requests (like sorting, pagination, or scraping).

### **Component Design**

- **StoryList**: Handles list/detail state, renders `StoryCard` and `StoryDetail`, preserves scroll position when toggling views.
- **StoryCard**: Clickable, accessible card for each story.
- **StoryDetail**: Shows full story info, author details, and comments. Fetches author data via `useAuthor` and comments via `useComments`.
- **Comment**: Individual comment component with support for nested replies and safe HTML rendering.
- **CommentsList**: Manages the list of comments with loading states and error handling.
- **LinkPreview**: Shows a rich preview for story URLs, using a Cheerio-based pure JS scraper and client-side image handling.
- **ClientImage**: Renders all external images using Next.js `<Image />` with a custom loader and `unoptimized`, bypassing domain restrictions.
- **useAuthor**: Custom hook for fetching and caching author info, using the public API route.
- **useComments**: Custom hook for fetching story comments with SWR caching.
- **useNestedComments**: Custom hook for lazy-loading nested comments on-demand.

### **Comments System**

- **Lazy Loading**: Comments are only fetched when the user clicks "show X replies" to improve performance
- **Nested Comments**: Unlimited depth, loaded on-demand as users expand threads
- **Safe HTML Rendering**: All comment content is sanitized with DOMPurify to prevent XSS attacks
- **Skeleton Loading**: Beautiful skeleton loaders while comments are being fetched
- **Error Handling**: Graceful error display if comments fail to load
- **SWR Integration**: Efficient caching and data fetching with SWR
- **Collapsible Threads**: All nested comments start collapsed for better UX

### **Pagination**

- The app supports paginated stories, with accessible, robust pagination controls.
- Pagination state is reflected in the URL for shareability and navigation.

### **Link Preview & Image Handling**

- Story details show a rich link preview (image, title, description, logo) using a pure JS Cheerio-based scraper (no native dependencies).
- All preview logic is in `src/lib/preview.ts` and proxied via `/api/preview`.
- All images and logos are resolved to absolute URLs, so previews work even if the source site uses relative paths.
- All images are rendered client-side with `ClientImage` (Next.js `<Image />` with custom loader and `unoptimized`), so there are no domain restrictions and no `<img>` tags.

### **SWR Data Fetching**

- SWR is used for client-side data fetching with automatic caching.
- Automatic refetching on window focus is **disabled** for a stable UX.
- Comments are cached for 1 minute to avoid unnecessary refetches.

### **Security**

- **DOMPurify**: All user-generated HTML content (comments, story text) is sanitized to prevent XSS attacks
- **Safe HTML Rendering**: Uses `dangerouslySetInnerHTML` only with sanitized content
- **Input Validation**: All API inputs are validated and sanitized

### **Testing Philosophy**

- All business logic is extracted to pure functions/modules for easy unit testing.
- Hooks are tested with real fetch mocking, not just stubs.
- UI is tested with React Testing Library for realistic user flows.
- Comments system is thoroughly tested with edge cases and error scenarios.

### **Code Quality**

- **Prettier** and **ESLint** enforce consistent style and catch errors.
- **Husky** and **lint-staged** ensure only well-formatted, linted code is committed.
- **TypeScript** is used everywhere for safety and maintainability.
- **DOMPurify** ensures safe HTML rendering throughout the application.

---

## 📝 Contributing

1. Fork the repo and create your branch.
2. Make your changes (with tests!).
3. Ensure all tests, lint, and type checks pass.
4. Submit a pull request.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/)
- [Husky](https://typicode.github.io/husky/)
- [DOMPurify](https://github.com/cure53/DOMPurify)

---

**Questions or feedback?**  
Open an issue or start a discussion!

---

**Ideas for improvement**

- Integrate the rest of the API.
- Add integration tests for components.
- A few Playwright end-to-end tests.
- Add Storybook and SonarCloud.
