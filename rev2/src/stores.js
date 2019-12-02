import { writable, derived } from 'svelte/store'
import uuid from './uuid.js';

export const tasks = writable(
	Object.fromEntries([
		"Buy milk",
		"Change winter tires",
		"Plough snow",
		"Go watch starry night sky",
		"Think about life and death"
	].map(name => [uuid(), { isDone: false, name }]))
)
