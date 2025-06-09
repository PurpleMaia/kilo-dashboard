# Intern Onboarding for KILO Dashboard

### Current State of Frontend

- ✅ **Dashboard Home**: Baseline layout (header/sidebar)
- ✅ **Sensors Page**: Displays sensor cards + last update
- ✅ **Field Notes Page**: Embeds Google Form
- 🛠️ **To Build**:
    - Soil Composition Page
    - LLM Interaction Page (e.g. “Ask the ʻĀina”)
    - Mobile and offline-resilient UX tweaks

| Area | Role | Notes |
| --- | --- | --- |
| 🎨 Figma Dashboard Redesign | UI/UX Conceptualizer | Propose mobile-first layout improvements, improved data cards |
| 📋 Soil Composition Page | Component Developer | Create placeholder cards with mock data |
| 📡 Sensor Display UI | Data Visual Enhancer | Refactor sensor cards, status badges, last updated styling |
| 📱 Mobile UX Polish | Responsive Designer | Improve small-screen display, accessibility |
| 💬 LLM Page Prototype | Collaborator (w/ you) | Frontend UI for querying the LLM (mockup OK first) |

## Setup

**Tasks**:

- [ ]  Clone and run `kilo-dashboard`
- [ ]  Checkout to `summer ` branch
- [ ]  Explore existing routes and layout components
- [ ]  Review `README.md` and any design system in place
- [ ]  install Node.js into computer & install `pnpm`
    - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
    - https://pnpm.io/installation

### Mobile & Desktop Media Query Challenge

- [ ]  Create styling for a mobile and desktop version of the KILO dashboard
- [ ]  The desktop version should have the upload feature enabled but not on mobile

### Figma Redesign Challenge

**Tasks**:

- [ ]  Review current dashboard layout on desktop and mobile
- [ ]  Create a Figma redesign proposal for:
    - Home/dashboard
    - Sensor display page
    - Soil data page
- [ ]  Justify changes (typography, spacing, icons, card flow)

### Soil Composition Page

**Goal**: Create a new frontend page using mock data

**Tasks**:

- [ ]  Create route `/soil`
- [ ]  Grab data from .csv or from established table
- [ ]  Style cards to be mobile-friendly
- [ ]  Include last updated timestamp and color indicators
- [ ]  Refer to Makaliʻi Metrics portal

### LLM Interaction

**Tasks**:

- [ ]  Work with you to understand what the LLM will do
- [ ]  Create UI mockup for interaction: input, suggestions, loading state
- [ ]  Add placeholder page `/ask`
- [ ]  Figure out api handling within NextJS (sign in and csv uploads will occur only on Svelte API side)