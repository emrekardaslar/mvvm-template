# Project Architecture: MVVM with React and SSR

This document outlines the proposed architecture for our project, integrating the Model-View-ViewModel (MVVM) pattern with React for the frontend and Server-Side Rendering (SSR) using Astro.

## Core Principles

*   **Separation of Concerns:** Clear distinction between data logic, UI logic, and presentation.
*   **Testability:** Components and logic should be easily testable in isolation.
*   **Maintainability:** Codebase should be organized and easy to understand for future development.
*   **Performance:** Leverage SSR for faster initial page loads and improved SEO.

## Architectural Components

### 1. Services

*   **Purpose:** To provide shared functionality and data access across the application, decoupled from any specific ViewModel or View.
*   **`api.ts`:** Simulates a remote API for fetching application data (e.g., products, filters). In a real application, this would handle actual HTTP requests.
*   **`eventBus.ts`:** A simple global event bus that allows disconnected components and ViewModels to communicate with each other (e.g., notifying the `ProductViewModel` that a filter has changed).

### 2. Model

*   **Purpose:** Represents the application's data and business logic. It is entirely UI-independent.
*   **Responsibilities:**
    *   Fetching data from APIs (via the API service), databases, or other external sources.
    *   Data validation and manipulation.
    *   Encapsulating business rules.
*   **Implementation:**
    *   Plain TypeScript/JavaScript classes or objects.
    *   Examples: `UserModel`, `ProductModel`, `OrderModel`.

### 3. View

*   **Purpose:** The user interface layer, responsible for rendering what the user sees and capturing user input.
*   **Responsibilities:**
    *   Displaying data provided by the ViewModel.
    *   Dispatching events to its own ViewModel in response to user interactions.
    *   Should be as "dumb" as possible, containing minimal to no business logic.
*   **Implementation:**
    *   React Components.
    *   Receives `initialData` as a prop and instantiates its own ViewModel on the client-side.
    *   Utilizes dedicated external CSS files for styling, imported directly into the component.

### 4. ViewModel

*   **Purpose:** Acts as an intermediary between the Model and the View. It transforms Model data into a format suitable for the View and handles View-specific logic and state.
*   **Responsibilities:**
    *   Exposing data to the View in an easily consumable format.
    *   Holding the View's state (`data`).
    *   Listening for events from its View (via `runAttachedFunction`) and from other ViewModels (via the `eventBus`).
*   **Implementation:**
    *   TypeScript/JavaScript classes, inheriting from `BaseViewModel`.
    *   Examples: `CounterViewModel`, `ProductViewModel`, `FilterViewModel`.

### 4.1. BaseViewModel

*   **Purpose:** Provides common functionality, state management, and an event mechanism for all other ViewModels.
*   **Responsibilities:**
    *   Managing the ViewModel's `data` and notifying listeners of changes.
    *   Providing lifecycle methods (`onMount`, `onUnmount`).
    *   Offering `runAttachedFunction` (for View-to-ViewModel events) and `registerEvent` methods.
*   **Implementation:**
    *   A generic TypeScript class (`BaseViewModel<TData>`) located in `src/viewmodels/BaseViewModel.ts`.

### 4.2. `useViewModel` Hook

*   **Purpose:** A custom React hook to seamlessly integrate ViewModels with React functional components, handling client-side instantiation.
*   **Responsibilities:**
    *   Accepts a ViewModel *class* and `initialData`.
    *   Instantiates the ViewModel internally using the provided `initialData`.
    *   Subscribes the React component to the ViewModel's data changes.
    *   Triggering component re-renders when the ViewModel's data updates.
    *   Calling the ViewModel's `onMount` and `onUnmount` lifecycle methods.
*   **Implementation:**
    *   A React hook (`useViewModel`) located in `src/hooks/useViewModel.ts`.

### 4.3. `LangViewSwitcher` Component

*   **Purpose:** A generic React component to handle dynamic, language-dependent view switching.
*   **Responsibilities:**
    *   Accepts a ViewModel *class*, `initialData`, and a `viewName`.
    *   Instantiates the ViewModel on the client-side using `initialData`.
    *   Listens for `languageChanged` events from the `eventBus`.
    *   Uses `viewMap` to dynamically load the correct view component based on the current language.
    *   Renders the selected view component, passing the ViewModel instance as a prop.
*   **Implementation:**
    *   A generic React component (`LangViewSwitcher`) located in `src/components/LangViewSwitcher.tsx`.

### 4.4. Styling

*   **Purpose:** To provide a consistent and maintainable approach to styling React components.
*   **Implementation:**
    *   Each view and component has its own dedicated CSS file (e.g., `ProductList.css`, `Filter.css`, `Counter.css`, `LanguageSelector.css`, `Banner.css`).
    *   These CSS files are imported directly into their respective React components.
    *   Class names are used to apply styles, avoiding inline styles where possible, except for dynamic overrides (e.g., `Banner` component).

### 5. Server-Side Rendering (SSR) with Astro

*   **Purpose:** To generate the initial HTML content of the page on the server before sending it to the client.
*   **Responsibilities:**
    *   Orchestrating initial data fetching (e.g., for the initial product list).
    *   Passing the ViewModel's `initialData` to the React components.
*   **Implementation:**
    *   Astro pages (`.astro` files) serve as the entry points.

## Examples

### Counter Example

A simple example to demonstrate the basic MVVM flow.

*   **`CounterViewModel`:** Registers handlers for `increment` and `decrement` events.
*   **`CounterView`:** Dispatches `increment` or `decrement` events to the ViewModel using `viewModel.runAttachedFunction()`.

### Product/Filter Example

A more advanced example demonstrating client-side data fetching and inter-ViewModel communication.

*   **`FilterViewModel`:** If its initial data is empty, it fetches the available filters from the `api.ts` service in its `onMount` method. When a filter is selected, it updates its own state and dispatches a `filterChanged` event on the global `eventBus`.
*   **`ProductViewModel`:** Subscribes to the `filterChanged` event on the `eventBus`. When the event is received, it fetches a new list of products from the `api.ts` service. During loading, the product list is visually grayed out instead of displaying a "Loading..." message. Product categories are rendered with explicit left-to-right direction to prevent display issues in right-to-left language contexts.
*   **`index.astro`:** Renders the initial product list on the server. The filters are fetched on the client, demonstrating a hybrid SSR approach.

## Data Flow Overview

1.  **User Request:** A user navigates to a page.
2.  **Astro Page (Server-side):**
    *   The `.astro` page is executed on the server.
    *   It instantiates the relevant ViewModel(s).
    *   The ViewModel(s) interact with the Model(s) to fetch initial data.
    *   The `.astro` page then renders the root React component, passing the ViewModel's initial state as props.
3.  **React Rendering (Server-side):**
    *   React components render to HTML based on the initial state.
    *   This HTML, along with the serialized initial state, is sent to the client's browser.
4.  **Client-side Hydration:**
    *   The browser receives and displays the HTML.
    *   React on the client-side "hydrates" the static HTML, attaching event listeners and making the application interactive.
    *   From this point, the client-side ViewModel handles all subsequent state changes and user interactions.

## Benefits

*   **Clear Structure:** Well-defined roles for each component.
*   **Enhanced Testability:** Models and ViewModels can be tested independently of the UI.
*   **Improved Maintainability:** Changes in the UI often don't require changes in the Model, and vice-versa.
*   **Better Performance & SEO:** SSR provides a fast initial load and is search engine friendly.
*   **Scalability:** Easier to manage complexity as the application grows.
