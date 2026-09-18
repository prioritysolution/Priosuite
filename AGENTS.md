# AGENTS.md — Project Architecture Guide (for Cursor / AI IDEs)

Copy this file into any new project (or keep it here). Give it to Cursor, Claude, Copilot, etc. so the agent follows the same architecture **and uses the same updated packages**.

For a **plain-text drop-in** (architecture + stack + same page design), copy `PRIOSUITE_STARTER.txt` into the other repo root, and copy `.cursor/rules/*.mdc` into that project’s `.cursor/rules/`.

---

## Product

**PrioSuite / prio_bank** — Next.js frontend for cooperative banking.  
Talks to a **remote REST API** (`NEXT_PUBLIC_BASE_API_URL`). This repo is UI + orchestration only (not the main backend).

---

## Package policy (required for AI)

When creating a **new project** or adding dependencies:

1. Prefer packages and versions from the list below (current stack).
2. Use **latest compatible** majors already chosen here (do not downgrade to older Next 12/13, React 17, Tailwind 3, etc.).
3. Install with the same family: `next@^15`, `react@^18`, `tailwindcss@^4`, `@reduxjs/toolkit@^2`, `axios@^1`, `yup@^1`.
4. Do **not** introduce alternate stacks (Zustand instead of Redux, Formik instead of RHF, MUI as default form kit) unless the user explicitly asks.
5. Pin `react-day-picker` to **8.x** (`8.10.1`) — this project is not on v9.
6. Prefer existing libs already installed (Radix UI, lucide-react, recharts/ag-charts, antd only where already used).

### Core stack (updated)

| Layer | Package | Version |
|-------|---------|---------|
| Framework | `next` | `^15.2.4` |
| UI | `react` / `react-dom` | `^18.3.1` |
| Language | `typescript` | `5.8.2` |
| CSS | `tailwindcss` | `^4.3.3` |
| CSS PostCSS | `@tailwindcss/postcss` / `postcss` | `^4.3.3` / `^8.5.26` |
| Forms | `react-hook-form` | `^7.52.1` |
| Forms resolvers | `@hookform/resolvers` | `^3.9.0` |
| Validation | `yup` | `^1.7.1` |
| State | `@reduxjs/toolkit` | `^2.11.2` |
| State bindings | `react-redux` | `^9.2.0` |
| HTTP | `axios` | `^1.16.0` |
| Dates | `date-fns` | `^3.6.0` |
| Calendar | `react-day-picker` | `8.10.1` |
| Tables | `@tanstack/react-table` | `^8.19.3` |
| Toasts | `react-hot-toast` | `^2.6.0` |
| Icons | `lucide-react` / `react-icons` | `^1.14.0` / `^5.6.0` |
| Charts | `recharts` / `ag-charts-react` | `^3.0.0` / `^13.1.0` |
| Motion | `framer-motion` | `^12.38.0` |
| Class utils | `clsx` / `tailwind-merge` / `cva` | `^2.1.1` / `^3.6.0` / `^0.7.0` |
| Cookies | `js-cookie` / `crypto-es` | `^3.0.5` / `^3.1.3` |
| Print/PDF | `react-to-print` / `jspdf` / `html2canvas` | `^3.0.5` / `^4.2.1` / `^1.4.1` |
| Images | `sharp` | `^0.35.3` |
| Lint | `eslint` / `eslint-config-next` | `^9.39.4` / `^15.2.4` |

### UI primitives (Radix — keep these families)

Use existing `@radix-ui/react-*` packages already in `package.json` (dialog, popover, select, scroll-area, checkbox, tabs, tooltip, etc.). Prefer `components/ui/*` wrappers over raw Radix in screens.

### Also available (use only when needed)

- HeroUI: `@heroui/*` (autocomplete, modal, theme, …)
- Ant Design: `antd@^6.3.1` (legacy/specific screens only — prefer shared formFields for new work)
- Emotion: `@emotion/react`, `@emotion/styled`

### New project scaffold scripts

```json
{
  "scripts": {
    "dev": "next dev -p 8000",
    "build": "next build",
    "start": "next start -p 8000",
    "lint": "next lint"
  }
}
```

When scaffolding a new app with this architecture, generate a `package.json` aligned to the versions above (or bump within the same major if the user asks for “latest”).

---

## Stack (short)

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 App Router |
| UI | React 18, Tailwind 4, Radix / shadcn-style `components/ui` |
| Forms | react-hook-form + yup |
| State | Redux Toolkit (feature slices) |
| HTTP | axios via `utils/apiConfig.js` |
| Auth | Encrypted cookies + Bearer token |
| Path alias | `@/*` → project root |

---

## Folder map (do not invent a different structure)

```text
app/                 # Routes only (thin pages + layouts)
container/           # Feature logic: Hooks, Apis, Reducers, container index
components/          # Screen UI (presentational)
common/              # Shared formFields, tables, charts, dialogs
redux/               # configureStore + ReduxProvider
utils/               # apiConfig, endPoints, cookies, helpers
lib/                 # Small helpers (cn, etc.)
hooks/               # Generic hooks
public/              # Static assets
```

---

## Mandatory feature pattern

Every feature MUST follow this flow:

```text
app/(dashboard)/<domain>/<feature>/page.jsx
  → container/<domain>/<feature>/index.jsx
      → Hooks.js          (forms, validation, API calls, Redux dispatch)
      → *Apis.js          (HTTP wrappers)
      → *Reducer.js       (optional RTK slice for lists/masters)
  → components/<domain>/<feature>/index.jsx  (UI only)
```

### Layer rules (AI must obey)

1. **`app/.../page.jsx`**
   - Metadata + render one container.
   - No business logic, no API calls, no Redux.

2. **`container/.../index.jsx`**
   - `"use client"`.
   - Read cookies (`orgId`, token).
   - Call hooks; load masters in `useEffect`.
   - Pass props into the component. Keep orchestration thin.

3. **`container/.../Hooks.js`**
   - Own: `useForm` + yup schema, loading, success dialogs, submit handlers.
   - Call Apis; `dispatch` list data into Redux when needed.
   - Export a named hook: `useFeatureName`.

4. **`container/.../*Apis.js`**
   - Only build `{ url, bodyData }` and call `doGetApiCall` / `doPostApiCall`.
   - URLs come from `utils/endPoints.js` — do not hardcode full API paths in Apis.

5. **`container/.../*Reducer.js`**
   - RTK slice for shared dropdown/table data.
   - Register the slice in `redux/configureStore.js`.

6. **`components/...`**
   - Presentational UI only.
   - Use `common/formFields` (`DatePickerField`, `DropdownField`, `InputField`, etc.).
   - Do not call APIs or define yup schemas here (unless a tiny local UI concern).

---

## Adding a NEW feature (checklist for AI)

When the user asks to add a screen (example: `investment/foo`):

1. Create `app/(dashboard)/investment/foo/page.jsx` → mount container.
2. Create `container/investment/foo/{index.jsx, Hooks.js, FooApis.js, FooReducer.js?}`.
3. Create `components/investment/foo/index.jsx`.
4. Add endpoints in `utils/endPoints.js`.
5. If using Redux lists → register reducer in `redux/configureStore.js`.
6. Reuse existing hooks/APIs when the same master data already exists.
7. Match existing UI patterns (border-primary panels, ScrollArea, responsive grids).
8. Use libraries from the package list above only.

Do **not** put all logic in the page or in a single giant component file.

---

## Auth & session

- Token cookie: `prioBankClientToken`
- Common cookies: `orgId`, `userBranchId`, `finId`, `beg_date`, `fin_start_date`, `fin_end_date`
- Read via `getCookieData()`; write via `secureCookieHelper` (encrypted).
- Dashboard layout redirects to `/login` if token missing.
- API 401 → clear token and redirect to `/login` (`utils/apiConfig.js`).

---

## API conventions

```js
// endPoints.js
getSomething: (orgId) => `${createApi}Org/Module/Action?org_id=${orgId}`

// *Apis.js
export const getSomethingAPI = async (orgId) => {
  return doGetApiCall({ url: endPoints.getSomething(orgId) });
};

// Hooks.js
const res = await getSomethingAPI(orgId);
if (res.message === "Data Found" || res.message === "Success") {
  dispatch(setData(res.details)); // or res.Data
}
```

- Base URL: `process.env.NEXT_PUBLIC_BASE_API_URL`
- Prefer checking both `details` and `Data` when parsing list responses (APIs vary).

---

## Forms & validation

- Always `react-hook-form` + `yup` + `yupResolver` in Hooks.
- Shared regex: `utils/validationRegex.js`.
- Dates: prefer `DatePickerField`; store as `Date` at **local noon** (see `utils/dateHelpers.js`) so timezone never shifts the day.
- API payloads: prefer `formatDateForApi(value)` from `@/utils/dateHelpers` (or `format(date, "yyyy-MM-dd")` only on noon-normalized Dates). Never use `toISOString().slice(0, 10)` or `new Date("yyyy-MM-dd")` for calendar days.
- Display: `dd-MM-yyyy` via `formatDateForDisplay` or date-fns `format`.
- Calendar: `react-day-picker@8` API (not v9).
- Required fields: mark UI with `isRequired` and mirror in yup.

---

## UI conventions (all form / master / report / transaction pages must match)

Do not invent a new look. Copy the nearest existing screen.

**Chrome:** Open Sans · `--radius: 0.5rem` · primary `hsl(219 94% 20%)` · sidebar/footer `#00264D` · page card `#fefefe` · main `bg-gray-50`.

**Page shell:**

```jsx
<div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
  <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
    <h3 className="text-2xl font-semibold">Page Title</h3>
    <ScrollArea className="w-full h-full">{/* sections */}</ScrollArea>
  </div>
</div>
```

- Inner sections: `border border-primary rounded-lg p-3 sm:p-5` + centered `text-xl font-semibold` title
- Fields grid: `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3`
- Fields: `common/formFields` only (`h-10 rounded-md`); required = red `*` via `isRequired`
- Submit: `Button type="submit" className="w-full sm:w-1/5 self-end"` + `ClipLoader color="#d7e6f4"`
- Tables: `components/ui/table` + `border border-primary`
- Success: `common/dialog/SuccessMessage` · toasts top-right
- Forms: `autoComplete="off"`; inner buttons `type="button"` unless submit
- Full-height + `ScrollArea` (the page itself does not scroll)
- Exceptions: login (branded) and dashboard home (`bg-slate-50` + cards) — do not force this shell

Full copy-paste tokens, CSS, and exceptions: `PRIOSUITE_STARTER.txt` section 8.

---

## Redux conventions

- One slice per feature domain (or shared domain like `investmentOpenAccount`).
- Containers/components read with `useSelector((state) => state.sliceKey…)`.
- Do not store entire form drafts in Redux unless the existing feature already does.

---

## What AI must NOT do

- Do not invent a different folder architecture (no `services/`, `views/`, `features/` unless user asks).
- Do not call axios directly from components.
- Do not commit `.env`, secrets, or credentials.
- Do not add drive-by refactors unrelated to the task.
- Do not rewrite shared DatePicker / Dropdown unless fixing a real bug.
- Do not create markdown docs unless the user asks.
- Do not install outdated replacements (e.g. Next 13, Tailwind 3, Redux without Toolkit) when scaffolding.

---

## Quick “where do I edit?” map

| Goal | Edit |
|------|------|
| New route | `app/(dashboard)/.../page.jsx` |
| Load data / submit | `container/.../Hooks.js` |
| API URL | `utils/endPoints.js` + `*Apis.js` |
| Screen layout | `components/.../index.jsx` |
| Shared input | `common/formFields/...` |
| Global store | `redux/configureStore.js` |
| Cookies / auth helpers | `utils/getCookieData.js`, `secureCookieHelper.js` |
| Dependencies | `package.json` (keep versions aligned with this guide) |

---

## Example mental model

```text
User opens /investment/investmentClose
  → thin page
  → container wires hooks + initial API loads
  → Hooks owns form + close logic
  → Apis hit endPoints
  → component renders fields/tables
  → Redux supplies dropdown options if needed
```

When unsure, **copy the nearest existing feature in the same domain** and adapt it.
