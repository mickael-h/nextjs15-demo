# Next.js 15 Hacker News Top Stories Demo

A modern, production-grade demo app built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.  
It fetches and displays the top 20 stories from Hacker News, with author details, dark mode, robust testing, and strict code quality enforcement.

---

## 🚀 Features

- **Next.js 15 App Router** with React Server Components (RSC) and Client Components
- **TypeScript** throughout for type safety
- **Tailwind CSS** for styling and dark mode
- **API proxying**: All HN API requests go through your Next.js backend
- **Author details**: View karma and account creation date for each story's author
- **Accessibility**: Keyboard navigation, ARIA labels, and semantic HTML
- **Testing**: Jest, React Testing Library, and code coverage
- **Prettier, ESLint, Husky, lint-staged**: Enforced code style and pre-commit checks

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

## 🧪 Testing & Linting

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

### Pre-commit Hook

- Husky and lint-staged are set up to run Prettier and ESLint on staged files before every commit.
- If you add new hooks, use:
  ```bash
  npx husky add .husky/pre-commit "npx lint-staged"
  ```

---

## 🏗️ Code Architecture & Decisions

### **Directory Structure**

- `src/app/` — Next.js App Router, API routes, pages, and layout
- `src/components/` — UI components (StoryList, StoryCard, StoryDetail)
- `src/hooks/` — Custom React hooks (for `useAuthor`)
- `src/lib/` — Pure backend logic (for HN API fetchers, easily unit tested)

### **API Proxying**

- All requests to the Hacker News API are proxied through `/api/hn/top20` and `/api/hn/user/[username]` routes.
- This enables error handling and add whatever business logic we want to add to the requests (like sorting).

### **Component Design**

- **StoryList**: Handles list/detail state, renders `StoryCard` and `StoryDetail`.
- **StoryCard**: Clickable, accessible card for each story.
- **StoryDetail**: Shows full story info and author details, fetches author data via `useAuthor`.
- **useAuthor**: Custom hook for fetching and caching author info, using the public API route.

### **Testing Philosophy**

- All business logic is extracted to pure functions/modules for easy unit testing.
- Hooks are tested with real fetch mocking, not just stubs.
- UI is tested with React Testing Library for realistic user flows.

### **Code Quality**

- **Prettier** and **ESLint** enforce consistent style and catch errors.
- **Husky** and **lint-staged** ensure only well-formatted, linted code is committed.
- **TypeScript** is used everywhere for safety and maintainability.

---

## 📝 Contributing

1. Fork the repo and create your branch.
2. Make your changes (with tests!).
3. Ensure all tests and lint checks pass.
4. Submit a pull request.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/)
- [Husky](https://typicode.github.io/husky/)

---

**Questions or feedback?**  
Open an issue or start a discussion!
