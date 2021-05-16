/**
 * Get string value or first string value of an array
 *
 * @returns string value
 */
export const getQueryElement = (value: string | string[]) =>
  typeof value === 'string' ? value : value[0];

/**
 * Get string values (also first string value of an array) omitting undefined values
 *
 * @returns query string values
 */
export const getQueryElements = (query: {
  [key: string]: string | string[] | undefined;
}) =>
  Object.entries(query).reduce(
    (elements: { [key: string]: string }, [key, value]) =>
      value
        ? {
            ...elements,
            [key]: getQueryElement(value),
          }
        : elements,
    {},
  );
