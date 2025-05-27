import { formatTime, getCurrentWeekKey } from "../time";

test("formatTime formats correctly", () => {
  expect(formatTime(3661)).toBe("01:01:01");
  expect(formatTime(61)).toBe("01:01");
});

test("getCurrentWeekKey returns string", () => {
  expect(typeof getCurrentWeekKey()).toBe("string");
});
