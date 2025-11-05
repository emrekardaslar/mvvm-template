# Project Architecture: MVVM with React and SSR

This document outlines the proposed architecture for our project, integrating the Model-View-ViewModel (MVVM) pattern with React for the frontend and Server-Side Rendering (SSR) using Astro.

## Core Principles

*   **Separation of Concerns:** Clear distinction between data logic, UI logic, and presentation.
*   **Testability:** Components and logic should be easily testable in isolation.
*   **Maintainability:** Codebase should be organized and easy to understand for future development.
*   **Performance:** Leverage SSR for faster initial page loads and improved SEO.

## Architectural Components

### 1. Model

*   **Purpose:** Represents the application's data and business logic. It is entirely UI-independent.
*   **Responsibilities:**
    *   Fetching data from APIs, databases, or other external sources.
    *   Data validation and manipulation.
    *   Encapsulating business rules.
*   **Implementation:**
    *   Plain TypeScript/JavaScript classes or objects.
    *   Examples: `UserModel`, `ProductModel`, `OrderModel`.

### 2. View

*   **Purpose:** The user interface layer, responsible for rendering what the user sees and capturing user input.
*   **Responsibilities:**
    *   Displaying data provided by the ViewModel.
    *   Dispatching events to the ViewModel in response to user interactions (clicks, input changes, etc.).
    *   Should be as "dumb" as possible, containing minimal to no business logic.
*   **Implementation:**
    *   React Components.
    *   These components will receive an instance of their ViewModel as a prop and use its `dispatch` method to send events.

### 3. ViewModel

*   **Purpose:** Acts as an intermediary between the Model and the View. It transforms Model data into a format suitable for the View and handles View-specific logic and state.
*   **Responsibilities:**
    *   Exposing data from the Model to the View in an easily consumable format.
    *   Holding the View's state.
    *   Listening for events dispatched by the View and executing corresponding logic (e.g., updating the Model or its own state).
    *   Providing methods for data binding.
*   **Implementation:**
    *   TypeScript/JavaScript classes, often inheriting from a `BaseViewModel`.
    *   Each significant View or section of a View will typically have its own ViewModel.
    *   Examples: `UserProfileViewModel`, `ProductListViewModel`, `LoginFormViewModel`.

### 3.1. BaseViewModel

*   **Purpose:** Provides common functionality, state management, and an event dispatching/handling mechanism for all other ViewModels, promoting code reuse and consistency.
*   **Responsibilities:**
    *   Managing the ViewModel's state and notifying listeners (Views) of changes.
    *   Providing lifecycle methods (`onMount`, `onUnmount`) for setup and cleanup.
    *   Offering `dispatch` and `on` methods for event-based communication.
    *   Handling common loading and error states (can be added later).
*   **Implementation:**
    *   A generic TypeScript class (`BaseViewModel<TState>`) located in `src/viewmodels/BaseViewModel.ts`.
    *   Utilizes a `Set` of listeners to notify subscribed React components of state changes.
    *   Uses a `Map` to manage event handlers, allowing ViewModels to subscribe to events.

### 3.2. `useViewModel` Hook

*   **Purpose:** A custom React hook to seamlessly integrate ViewModels with React functional components.
*   **Responsibilities:**
    *   Subscribing the React component to the ViewModel's state changes.
    *   Triggering component re-renders when the ViewModel's state updates.
    *   Calling the ViewModel's `onMount` and `onUnmount` lifecycle methods.
*   **Implementation:**
    *   A React hook (`useViewModel`) located in `src/hooks/useViewModel.ts`.
    *   Uses `useState` and `useEffect` to manage the component's subscription to the ViewModel.

### Example: CounterView and CounterViewModel

To illustrate the MVVM pattern with event-based communication, we've created a simple counter example:

*   **`CounterViewModel` (`src/viewmodels/CounterViewModel.ts`):** Extends `BaseViewModel`. It registers handlers for `increment` and `decrement` events, which then modify its `count` state.
*   **`CounterView` (`src/views/CounterView.tsx`):** A React functional component that receives an instance of `CounterViewModel` as a prop. It uses the `useViewModel` hook to subscribe to the ViewModel's state and renders the current count. User interactions (button clicks) dispatch `increment` or `decrement` events to the ViewModel using `viewModel.dispatch()`.

### 4. Server-Side Rendering (SSR) with Astro

*   **Purpose:** To generate the initial HTML content of the page on the server before sending it to the client. This enhances perceived performance, improves SEO, and provides a better user experience.
*   **Responsibilities:**
    *   Orchestrating the initial data fetching.
    *   Instantiating the necessary ViewModels on the server.
    *   Passing the ViewModel's initial state to the React View components.
    *   Rendering the React components to HTML.
*   **Implementation:**
    *   Astro pages (`.astro` files) will serve as the entry points.
    *   Astro's integration with React allows us to render React components on the server.
    *   The initial state can be serialized and passed to the client-side React application for "hydration," allowing React to take over interactivity seamlessly.

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
