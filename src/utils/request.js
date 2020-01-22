import axios from "axios";

const instance = axios.create({
  baseURL: "http://api.shanghaim.net/mock/28/api/",
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" }
});

export default instance;
