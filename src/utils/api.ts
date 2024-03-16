function createURL(path) {
  return window.location.origin + path;
}

export async function createNewEntry() {
  try {
    const response = await fetch(new Request(createURL('/api/journal')), {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateEntry(id: string, content) {
  const response = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(content),
    })
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}

export async function askQuestion(question) {
  const response = await fetch(new Request(createURL('/api/question')), {
    method: 'POST',
    body: JSON.stringify({ question }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
}
