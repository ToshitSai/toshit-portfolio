const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000");

async function request(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "CodeSense AI could not process that request.");
  }

  return data;
}

export const codeSenseApi = {
  explain: (payload) => request("/explain", payload),
  convert: (payload) => request("/convert", payload),
  debug: (payload) => request("/debug", payload),
  optimize: (payload) => request("/optimize", payload)
};
