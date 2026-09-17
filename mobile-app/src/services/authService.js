import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config/api";

const TOKEN_KEY = "fyp_auth_token";

async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to log in");
  }

  await SecureStore.setItemAsync(TOKEN_KEY, data.token);

  return data.user;
}

async function getCurrentUser() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return null;
  }

  const data = await response.json();

  return data.user;
}

async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export {
  login,
  getCurrentUser,
  logout,
};
