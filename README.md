# LECTURE NOTES (Section 10)

- Criteria for splitting UI into components.

  1. Logical seperation of components i.e each component should have a proper layout and should be logically seperated.
  2. Reuseability.
  3. Complexity.

- Component categories

1. Stateless/presentational components.
2. Stateful components.
3. Structural components.

- PROP DRILLING: passing props through multiple components, becomes unnecessary and hard to maintain.

  - Solutions: 1.) Component Composition. -- combining different components using children props.
    - used in situations such as 1.) Creating highly reusable and flexible components. 2.) Fixing prop drilling.

- Here is your key: 475999e8

- useEffect Hooks
  - dependency array
  - stale Closure
