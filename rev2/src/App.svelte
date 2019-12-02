<script>
	import uuid from './uuid.js';
	import { tasks } from './stores.js';

	let taskFilterText = '';
	let text;
	
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

	// Subscribe to store changes using auto-subscribe
	// $ = Svelte short-hand for referencing a stored value
	// https://svelte.dev/tutorial/auto-subscriptions  
	$: taskEntries = Object.entries($tasks)
	
	// We can also do subcriptions explicitly, allowing us
	// to access unsubscribe too:
	// Or subscribe to tasks store updates
	/*
	let taskEntries;

  const unsubscribe = tasks.subscribe(tasks => {
		// Updated derived taskEntries object whenever store updates
		taskEntries = Object.entries(tasks);
	});
	*/
		
	// Insert server-originated tasks with a small delay	
	setTimeout(() => {
		const newTasks = 
      serverTasks
				.filter(({ id }) => !tasks[id])
			  .map(({ id, name, isDone }) => [uuid(), { name, isDone }]);
		
		newTasks.forEach(([uuid, task]) => {
			// Mutate tasks object inside callback and returns new value to be set in store
			// Note that store objects can only be mutated inside update
			// https://svelte.dev/docs#writable
			tasks.update((tasks) => {
				tasks[uuid] = task;
				return tasks;
			});
		});
	}, 500);
			
	function addTask(name) {
		// Again, update store object by mutating inside update
		tasks.update((tasks) => {
			tasks[uuid()] = {
				name,
				isDone: false
			}
			return tasks;
		})
	}
	
	function deleteTask(uuid) {
		// Again, update store object by mutating inside update
		// NOTE! Updates to model are now generated without ugly self-assignments
		// because update operation compares the change against original store object
		tasks.update((tasks) => {
			delete tasks[uuid];
			return tasks;
		})
	}
	
	function onAddTask() {
		addTask(text);
		text = '';
	}
	
	function onDeleteTask(uuid) {
		deleteTask(uuid)
	}
</script>

<p>
  Found {taskEntries.length} tasks
</p>

<ul>
	{#each taskEntries as [uuid, item]}
		<li key={uuid}>
			<span>
        <span>{item.name}</span>
        
				<input type="checkbox" bind:checked={item.isDone} />
				<!-- bind:checked binds checks/unchecks to model updates -->				
				<!-- ...even with store, bind works -->
				
        <button on:click={() => onDeleteTask(uuid)}>Delete</button>
      </span>
	  </li>
	{/each}
</ul>

<div>
  <input type="text" bind:value={text} placeholder="Add task" />
  <button on:click={onAddTask}>Add</button>
</div>
