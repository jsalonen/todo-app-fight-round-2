<script>
  import uuid from 'uuid/v4'

  let taskFilterText = '';
  let text;

  let tasks = Object.fromEntries([
    "Buy milk",
    "Change winter tires",
    "Plough snow",
    "Go watch starry night sky",
    "Think about life and death"
  ].map(name => [uuid(), { isDone: false, name }]));

  let serverTasks =
    [
      "Write a TODO app",
      "Do something else",
      "Go outside",
      "Play",
      "Go jogging",
      "Wait for better Star Trek series"
    ].map(n => ({
      id: uuid(),
      name: n,
      isDone: false
    }))

  // Insert server-originated tasks with a small delay
  setTimeout(() => {
    const newTasks =
      serverTasks
        .filter(({ id }) => !tasks[id])
        .map(({ id, name, isDone }) => [uuid(), { name, isDone }]);

    newTasks.forEach(([uuid, task]) => {
      tasks[uuid] = task;
    });
  }, 500);

  // Use reactive statement to derive object entries
  // Everytime tasks object changes, this reactive statement
  // is updated immediately before next component render
  // See: https://svelte.dev/docs#3_$_marks_a_statement_as_reactive
  $: taskEntries = Object.entries(tasks)

  function addTask(name) {
    tasks[uuid()] = {
      name,
      isDone: false
    }
  }

  function onAddTask() {
    addTask(text);
    text = '';
  }

  function onDeleteTask(uuid) {
    tasks[uuid]; // Surprise! Delete on object does not trigger an update
    tasks = tasks; // Using as a workaround. See: https://github.com/sveltejs/svelte/issues/3211
  }
</script>

<p>
  Found {taskEntries.length} tasks
</p>

<ul>
  {#each Object.entries(tasks) as [uuid, item]}
    <li key={uuid}>
      <span>
        <span>{item.name}</span>

        <input type="checkbox" bind:checked={item.isDone} />
        <!-- bind:checked binds checks/unchecks to model updates -->

        <button on:click={() => onDeleteTask(uuid)}>Delete</button>
      </span>
    </li>
  {/each}
</ul>

<div>
  <input type="text" bind:value={text} placeholder="Add task" />
  <button on:click={onAddTask}>Add</button>
</div>
