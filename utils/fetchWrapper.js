/**
 *
 * @param {string} url
 * @param {string} token
 * @param {string} method
 * @param {object} payload
 * @returns
 */

const fetchWrapper = async (path, token, method, payload) => {
    const baseUrl = `https://cautious-adventure-1fcb75477ff3.herokuapp.com`;
  
    // Prepare the URL
    let url = new URL(baseUrl + path);
  
    // Append query parameters for GET requests
    if (method === "GET" && payload) {
      Object.keys(payload).forEach(key =>
        url.searchParams.append(key, payload[key])
      );
    }
  
    // Initialize requestOptions with method and headers
    let requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        // Automatically add the JWT token to the headers if not a login/signup request
        ...(token && !["/login", "/signup"].includes(path) && { Authorization: token }),
      },
    };
  
    // Only add body for non-GET requests
    if (method !== "GET") {
      requestOptions.body = JSON.stringify(payload);
    }
  
    // Call the native fetch function
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        // Handle specific error for invalid token
        if (response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
          return; // Stop execution if token is invalid
        }
        // Throw or handle other non-OK responses here as needed
        throw new Error('Response not OK');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
  
  
  export default fetchWrapper;
  