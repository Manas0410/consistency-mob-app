import axios from 'axios';

const baseURL = 'https://25hour-server.vercel.app/';

let userId = null;
export function setUserId(id) {
  userId = id;
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    if (userId) {
      config.headers['user-id'] = userId;
    }
    return config;
  },
  error => Promise.reject(error)
);

// export default api;

//  const { user } = useUser();

//   React.useEffect(() => {
//     if (user?.id) {
//       setUserId(user.id);
//     }
//   }, [user]);