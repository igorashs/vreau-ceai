// returns the string value or first string element if it is an array
export const getQueryElement = (value: string | string[]) =>
  typeof value === 'string' ? value : value[0];

// returns string values || first string element of an array omitting undefined values
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
