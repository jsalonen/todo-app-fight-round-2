# TODO App Fight Round 2

## Svelte

## Quick intro to Svelte

- Svelte: https://svelte.dev/
- Compiles itself away, no runtime deps
  - Doesn't need virtual DOM
  - Reactivity built-in to the language

## First TODO app in Svelte ("rev1")

- Started by hacking with Svelte REPL (https://svelte.dev/repl/)
- Original at https://svelte.dev/repl/fdf996882cba49fa8f1120dbe24cb217?version=3.16.0

## State

State stored as variables inside component's script tag:

    let taskFilterText: 'buy'
    let text: 'new todo'
    let tasks: {
      { '053eaaec': { name: 'Buy milk', isDone: false } },
      { '05312312', { name: 'Change winter tires', isDone: false } },
      { '12319823', { name: 'Plough snow', isDone: false } }
    }

## Reactive Assignments

https://svelte.dev/tutorial/reactive-assignments

Svelte automatically updates the DOM when your component's state changes

Example:

    let count = 0
    ...
    count += 1

Svelte instruments these assignments at compile time:

    count += 1; $$invalidate(0, count)

## Reactive Declarations

https://svelte.dev/tutorial/reactive-declarations


Example:

    $: doubled = count * 2

Compiled:

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*count*/ 1) {
        $: $$invalidate(1, doubled = count * 2)
      }
    }

## Second TODO app in Svelte ("rev2")

Create a writable store to hold state (https://svelte.dev/docs#writable)

    import { writable, derived } from 'svelte/store'

    export const tasks = writable(
      { '053eaaec': { name: 'Buy milk', isDone: false } },
      { '05312312', { name: 'Change winter tires', isDone: false } },
      { '12319823', { name: 'Plough snow', isDone: false } }
    )

## Updating store

Immer-style updates with `update`:

Mutate tasks object inside callback and returns new value to be set in store

    tasks.update((tasks) => {
      tasks[uuid] = task
      return tasks
    })

There is also `set`

Stores are immutable outside these operations
