import axios from "axios";

const baseURLs = [
  "https://fda-antique-dealing-our.trycloudflare.com",
  "http://127.0.0.1:8000", 
];

// Choose base URL dynamically
const currentBaseURL = window.location.hostname !== "localhost"
  ? baseURLs[0]
  : baseURLs[1];

console.log("Hostname:", window.location.hostname); // Log the hostname
console.log("Selected Base URL:", currentBaseURL); // Log the selected URL
const API = axios.create({
  baseURL: currentBaseURL,
});

export default API;
