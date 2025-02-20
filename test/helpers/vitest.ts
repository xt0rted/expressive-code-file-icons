import type { RunnerTask } from "vitest";

export function testName(task: RunnerTask) {
  if (!task.suite) {
    return task.name;
  }

  return `${task.suite.name} > ${task.name}`;
}
