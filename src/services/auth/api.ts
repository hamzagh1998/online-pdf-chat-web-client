import { axiosInstance } from "../axios-instance";

import { AUTH_API_ENDPOINTS } from "./api-endpoints";

import { SignupPayload } from "./types";

export async function signupUser(payload: SignupPayload) {
  axiosInstance.post(AUTH_API_ENDPOINTS.SIGNUP, payload);
}

export async function getUserData() {
  return (await axiosInstance.get(AUTH_API_ENDPOINTS.USER_DATA)).data;
}
