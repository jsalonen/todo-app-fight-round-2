# TODO App Fight Round 2

Second round of TODO app fight, held at Gofore Jyväskylä 2.12.2019

## Svelte

## Quick intro to Svelte

- Svelte: https://svelte.dev/
- Compiles itself away, no runtime deps
  - Doesn't need virtual DOM
  - Reactivity built-in to the language

## First TODO app in Svelte ("rev1")

**DEMO: https://svelte.dev/repl/fdf996882cba49fa8f1120dbe24cb217?version=3.16.0**

- Started by hacking with Svelte REPL (https://svelte.dev/repl/)

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

**DEMO: https://svelte.dev/repl/ade0cc36f4b94a8c926ee3583a983d08?version=3.16.0**

## Creating a Svelte store

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

## Observables support?

> As of 3.1.0, Svelte supports RxJS (and compatible, including
> the proposed TC39 standard) observables out of the box
>
> - https://twitter.com/sveltejs/status/1121762491917328384

Also:

> ...To meet the "store contract", your observable needs to emit its
> first value immediately. If you have an observable chain that may
> take a while to emit its first value, you'll typically need a "startWith"
> or "publishReplay(1)" or similar depending on the situation."
> 
> - https://github.com/sveltejs/svelte/issues/2549#issuecomment-524415845

## Example: RxJS Store

https://svelte.dev/repl/cfd3d3ba0534483481c91f2fc68e390f?version=3.16.0

    <script>
      // Adapted from: https://svelte.dev/repl/51144b5ef95b53d14aede232d58aa14b?version=3.1.0
      import {ajax} from "rxjs/ajax"
      import {pluck, startWith} from "rxjs/operators"
      
      const users$ = ajax(`https://api.github.com/users?per_page=5`).pipe(
        pluck("response"),
        startWith([]) // Required to fulfill Store's contract 
      )
    </script>

    {#each $users$ as user}
      <div>
        {user.login}
      </div>
    {/each}
