import axios from "axios";

export const api = axios.create({
  baseURL:
    "https://niazeducationscholarshipsbackend-production.up.railway.app/api",
});
