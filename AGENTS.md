# Agent Guidelines for product-board-frontend

## Commands
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `npx tsc --noEmit`
- **Test**: No test framework configured yet

## Code Style
- **Language**: TypeScript with strict mode enabled
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Imports**: External imports first, then internal imports using `@/` alias
- **Components**: Functional components with default export, PascalCase naming
- **Client Components**: Mark with `"use client"` directive at top
- **Error Handling**: Use try/catch with typed errors (`err: any`)
- **Types**: Explicit type annotations for props, state, and function parameters
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Hooks**: Standard React hooks (useState, useEffect) and Next.js hooks (useRouter)
- **File Structure**: app/ for pages, components/ for reusable components, lib/ for utilities</content>
<parameter name="filePath">/Users/dhruvpatel/Documents/product_board_frontend/product-board-frontend/AGENTS.md