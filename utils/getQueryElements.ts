export const getQueryElement = (value: string | string[]) =>
  typeof value === 'string' ? value : value[0];

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
