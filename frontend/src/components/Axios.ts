import axios from "axios";

function getUsername(): string | undefined {
  let str: string | undefined = localStorage.getItem("o")?.toString();
  if (str) {
    let json: any = JSON.parse(str);
    return json.u;
  }
  return undefined;
}

function getAuthHeader(): string | undefined {
  let str: string | undefined = localStorage.getItem("o")?.toString();
  if (str) {
    let json: any = JSON.parse(str);
    return json.t;
  }
  return undefined;
}

function setAuthHeader(username: string, token: string): void {
  const obj = {
    u: username,
    t: "Bearer " + token,
  };
  localStorage.setItem("o", JSON.stringify(obj));
}

function deleteAuthHeader(): void {
  localStorage.removeItem("o");
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      Authorization: getAuthHeader(),
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response) {
      console.log("Network error");
    } else {
      switch (error.response.status) {
        case 401:
          break;
        case 403:
          break;
        case 404:
          break;
        case 500:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export {
  getUsername,
  getAuthHeader,
  setAuthHeader,
  deleteAuthHeader,
  axiosInstance,
};
