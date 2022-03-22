import request from '../request';

export function getCode(email, passWord) {
  return request({
    url: '/getCode',
    method: 'post',
    params: {
      email, passWord,
    },
  });
}

export function login(code) {
  return request({
    url: '/login',
    method: 'POST',
    params: {
      code,
    },
  });
}

export function logout() {
  return request({
    url: '/logout',
    method: 'POST',
  });
}
