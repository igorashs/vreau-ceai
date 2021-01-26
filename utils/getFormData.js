export const getFormData = (data) => {
  const formData = new FormData();

  for (const name in data) {
    if (name === 'src') continue;

    formData.append(name, data[name]);
  }

  if (data.src[0]) {
    formData.append('src', data.src[0]);
  }

  return formData;
};
