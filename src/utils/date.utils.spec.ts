import { computeScheduledDate } from './date.utils';

describe('computeScheduledDate', () => {
  it('should schedule a lesson on the same week when the target weekday is later than or equal to the start day', () => {
    const startDate = new Date('2023-04-03T00:00:00Z'); // Monday
    const availableDays = [2]; // Tuesday
    const lessonIndex = 0; // перший урок
    const expectedDate = new Date('2023-04-04T00:00:00Z'); // Tuesday
    const result = computeScheduledDate(startDate, availableDays, lessonIndex);
    expect(result.toISOString()).toEqual(expectedDate.toISOString());
  });

  it('should schedule a lesson on the next week when the target weekday is earlier than the start day', () => {
    const startDate = new Date('2023-04-07T00:00:00Z'); // Friday
    const availableDays = [2]; // Tuesday
    const lessonIndex = 0;
    const expectedDate = new Date('2023-04-11T00:00:00Z'); // Tuesday next week
    const result = computeScheduledDate(startDate, availableDays, lessonIndex);
    expect(result.toISOString()).toEqual(expectedDate.toISOString());
  });

  it('should schedule lessons correctly with multiple available days and proper week offset', () => {
    const startDate = new Date('2023-04-03T00:00:00Z'); // Monday
    const availableDays = [1, 3, 5];

    // Lesson 0: target = availableDays[0] = 1 (Monday), weekOffset = 0 → April 3, 2023
    let result = computeScheduledDate(startDate, availableDays, 0);
    let expected = new Date('2023-04-03T00:00:00Z');
    expect(result.toISOString()).toEqual(expected.toISOString());

    // Lesson 1: target = availableDays[1] = 3 (Wednesday) → April 5, 2023
    result = computeScheduledDate(startDate, availableDays, 1);
    expected = new Date('2023-04-05T00:00:00Z');
    expect(result.toISOString()).toEqual(expected.toISOString());

    // Lesson 2: target = availableDays[2] = 5 (Friday) → April 7, 2023
    result = computeScheduledDate(startDate, availableDays, 2);
    expected = new Date('2023-04-07T00:00:00Z');
    expect(result.toISOString()).toEqual(expected.toISOString());

    // Lesson 3: weekOffset = floor(3 / 3) = 1, remainder = 0, target = availableDays[0] = 1 → Monday next week: April 10, 2023
    result = computeScheduledDate(startDate, availableDays, 3);
    expected = new Date('2023-04-10T00:00:00Z');
    expect(result.toISOString()).toEqual(expected.toISOString());
  });

  it('should handle a scenario with multiple lessons per week correctly', () => {
    const startDate = new Date('2023-04-01T00:00:00Z'); // Saturday
    const availableDays = [0, 2, 4];

    let result = computeScheduledDate(startDate, availableDays, 0);
    let expected = new Date('2023-04-02T00:00:00Z'); // Sunday, April 2, 2023.
    expect(result.toISOString()).toEqual(expected.toISOString());

    // Lesson 1: target = availableDays[1] = 2 (Tuesday) → diff = 2 - 6 = -4, +7 = 3, result = April 4, 2023.
    result = computeScheduledDate(startDate, availableDays, 1);
    expected = new Date('2023-04-04T00:00:00Z');
    expect(result.toISOString()).toEqual(expected.toISOString());

    // Lesson 2: target = availableDays[2] = 4 (Thursday) → diff = 4 - 6 = -2, +7 = 5, result = April 6, 2023.
    result = computeScheduledDate(startDate, availableDays, 2);
    expected = new Date('2023-04-06T00:00:00Z');
    expect(result.toISOString()).toEqual(expected.toISOString());
  });
});
