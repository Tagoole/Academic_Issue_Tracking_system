import axios from "axios";

const baseURLs = [
  "http://127.0.0.1:8000", // Local
  "https://deployappd-947412c051a5.herokuapp.com" // Online
];

// Choose base URL dynamically
const currentBaseURL = window.location.hostname === "localhost"
  ? baseURLs[0]
  : baseURLs[1];

const API = axios.create({
  baseURL: currentBaseURL,
});

export default API;
