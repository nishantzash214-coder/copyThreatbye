import API_BASE_URL from "./api";

export async function startGmailLogin() {
  const response = await fetch(`${API_BASE_URL}/gmail/login`);

  if (!response.ok) {
    throw new Error("Unable to connect to Gmail backend");
  }

  return await response.json();
}