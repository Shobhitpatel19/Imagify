import { surpriseMePrompts, surpriseMeJokes } from "../constants";

export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

const recentJokes = [];
const MAX_RECENT_JOKES = 40;

export function getRandomJoke() {
  let randomJoke;

  // Ensure the new joke is not in the list of recent jokes
  do {
    const randomIndex = Math.floor(Math.random() * surpriseMeJokes.length);
    randomJoke = surpriseMeJokes[randomIndex];
  } while (recentJokes.includes(randomJoke));

  // Add the new joke to the recent jokes queue
  recentJokes.push(randomJoke);

  // Remove the oldest joke if the queue exceeds the max size
  if (recentJokes.length > MAX_RECENT_JOKES) {
    recentJokes.shift();
  }

  return randomJoke;
}


