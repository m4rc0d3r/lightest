import axios from "axios";

import { API_URL } from "@/env";

export const authAPI = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/auth`,
});
