import { surpriseMePrompts, surpriseMeJokes } from "../constants";

export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export function getRandomJoke(joke) {
  const randomIndex = Math.floor(Math.random() * surpriseMeJokes.length);
  const randomJoke = surpriseMeJokes[randomIndex];

  if (randomJoke === joke) return getRandomJoke(joke);

  return randomJoke;
}

