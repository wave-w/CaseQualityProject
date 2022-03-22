import axios from 'axios';

export default function request(config) {
  const intance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    // withCredentials: true,
  });
  intance.interceptors.request.use(
    (req) => req,
    (error) => {
      console.log(error);
    },
  );
  intance.interceptors.response.use(
    (res) => res,
    (error) => {
      console.log(error);
    },
  );

  return intance(config);
}
