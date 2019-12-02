import { writable } from 'svelte/store'
import uuid from 'uuid/v4'

export const tasks = writable(
  Object.fromEntries([
    "Buy milk",
    "Change winter tires",
    "Plough snow",
    "Go watch starry night sky",
    "Think about life and death"
  ].map(name => [uuid(), { isDone: false, name }]))
);
