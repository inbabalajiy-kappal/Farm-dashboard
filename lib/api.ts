const BASE_URL = "http://localhost:5000/api/fields";

// GET all fields
export const getFields = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

// CREATE field
export const createField = async (data: any) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// UPDATE field
export const updateField = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// DELETE field
export const deleteField = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};