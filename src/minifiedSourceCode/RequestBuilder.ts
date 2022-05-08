import axios from "axios";

const config = {
  origin: "https://resy.com",
  baseUrl: "https://resy.com/",
  baseRequestUrl: "https://api.resy.com/",
  apiKey: "VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5",
};

export const RequestBuilderApi = {
  get,
  post,
  postProxy,
  delete: deleteMethod,
  deleteProxy,
};

function get(requestOptions) {
  return makeRequest("GET", requestOptions);
}
function post(requestOptions) {
  return makeRequest("POST", requestOptions);
}
function postProxy(requestOptions) {
  return makeRequest("POSTPROXY", requestOptions);
}
function deleteMethod(requestOptions) {
  return makeRequest("DELETE", requestOptions);
}
function deleteProxy(requestOptions) {
  return makeRequest("DELETEPROXY", requestOptions);
}
const token = null;
async function makeRequest(method, options) {
  const requestObj = getRequestObject(method, token, options);
  const response = await axios(requestObj);
  // evaluateHeadersForToken(
  //   response.headers["x-resy-migrated-auth-token"],
  //   AuthToken
  // );
  return response.data;
}
function getData(method, data) {
  if (
    data instanceof FormData ||
    method === "POSTPROXY" ||
    method === "DELETEPROXY"
  ) {
    return data;
  }
  if (method === "POST") {
    return parameterize(data);
  }
  return null;
}

function getHeaders(method, token, options) {
  const headers = {
    "X-Origin": config.origin,
    Authorization: 'ResyAPI api_key="'.concat(config.apiKey, '"'),
    "Cache-Control": "no-cache",
  };
  if (token && options.authAllowed !== false) {
    Object.assign(headers, {
      "X-Resy-Auth-Token": token,
      "X-Resy-Universal-Auth": token,
    });
  }
  if (options.data instanceof FormData) {
    Object.assign(headers, {
      "Content-Type": undefined,
    });
  }
  if (!(options.data instanceof FormData) && method === "POST") {
    Object.assign(headers, {
      "Content-Type": "application/x-www-form-urlencoded",
    });
  }
  return headers;
}
function getMethod(method) {
  switch (method) {
    case "POSTPROXY":
      return "POST";
    case "DELETEPROXY":
      return "DELETE";
    default:
      return method;
  }
}
function getParams(method, data) {
  if (data instanceof FormData) {
    return undefined;
  }
  if (method === "POST" || method === "POSTPROXY" || method === "DELETEPROXY") {
    return undefined;
  }
  return data;
}
function getRequestObject(method, token, options) {
  const request: Record<string, any> = {
    method: getMethod(method),
    headers: getHeaders(method, token, options),
    url: getUrl(options),
  };
  const data = getData(method, options.data);
  const params = getParams(method, options.data);
  const transformRequest = getTransformRequest(options.data);
  if (data) {
    request.data = data;
  }
  if (params) {
    request.params = params;
  }
  if (transformRequest) {
    request.transformRequest = transformRequest;
  }
  return request;
}
const transformRequestFunc = (x) => x;
function getTransformRequest(data) {
  if (data instanceof FormData) {
    return transformRequestFunc;
  }
  return null;
}
function getUrl(options) {
  return ""
    .concat(options.baseRequestUrl || config.baseRequestUrl)
    .concat(options.endpoint);
}
function parameterize(obj) {
  return Object.keys(obj)
    .map((k) => {
      if (typeof obj[k] === "object") {
        return ""
          .concat(encodeURIComponent(k), "=")
          .concat(encodeURIComponent(JSON.stringify(obj[k])));
      }
      return ""
        .concat(encodeURIComponent(k), "=")
        .concat(encodeURIComponent(obj[k]));
    })
    .join("&");
}
function evaluateHeadersForToken() {
  const token =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : undefined;
  const AuthTokenService =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (token) {
    AuthTokenService.set({
      token,
      type: "user",
    });
  }
}

export default RequestBuilderApi;
