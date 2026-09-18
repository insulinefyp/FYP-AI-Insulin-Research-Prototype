import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config/api";

const TOKEN_KEY = "fyp_auth_token";

async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function getProfile() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to retrieve profile");
  }

  return data.profile;
}

async function createProfile(profile) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "POST",
    headers,
    body: JSON.stringify(profile),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create profile");
  }

  return data.profile;
}

async function updateProfile(profile) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    headers,
    body: JSON.stringify(profile),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update profile");
  }

  return data.profile;
}

export {
  getProfile,
  createProfile,
  updateProfile,
};
