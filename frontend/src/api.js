import axios from "axios";

import axios from 'axios';

// Create a list of API configurations
const apiEndpoints = [
  {
    name: "local",
    instance: axios.create({
      baseURL: "http://127.0.0.1:8000",
    })
  },
  {
    name: "heroku",
    instance: axios.create({
      baseURL: "https://deployappd-947412c051a5.herokuapp.com/",
    })
  }
];

// Create a unified API object that will try each endpoint
const API = {
  async request(method, url, data = null, options = {}) {
    // Try each API endpoint until one succeeds
    for (const endpoint of apiEndpoints) {
      try {
        const response = await endpoint.instance[method](url, data, options);
        return response;
      } catch (error) {
        // If this is the last endpoint in the list, throw the error
        if (endpoint === apiEndpoints[apiEndpoints.length - 1]) {
          throw error;
        }
        // Otherwise, continue to the next endpoint
        console.log(`Request failed for ${endpoint.name}, trying next endpoint...`);
      }
    }
  },
  
  // Methods for different HTTP verbs
  get(url, options) {
    return this.request('get', url, null, options);
  },
  
  post(url, data, options) {
    return this.request('post', url, data, options);
  },
  
  put(url, data, options) {
    return this.request('put', url, data, options);
  },
  
  delete(url, options) {
    return this.request('delete', url, options);
  }
};

export default API;
