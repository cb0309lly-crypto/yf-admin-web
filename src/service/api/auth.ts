import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      password,
      username
    },
    method: 'post',
    url: '/auth/login'
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/user_info' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken
    },
    method: 'post',
    url: '/auth/refreshToken'
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ params: { code, msg }, url: '/auth/error' });
}

/**
 * 获取用户列表
 *
 * @param params 查询参数
 */
export function fetchUserList(params: { keyword?: string; page: number; pageSize: number }) {
  return request<{
    list: Array<{
      authLogin?: string;
      avatar?: string;
      nickname: string;
      no: string;
      phone: string;
    }>;
    total: number;
  }>({
    method: 'GET',
    params,
    url: '/auth/list'
  });
}
