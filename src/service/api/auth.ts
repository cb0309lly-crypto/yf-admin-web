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
      username,
      password
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
 * @param params 查询参数
 */
export function fetchUserList(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return request<{
    list: Array<{
      no: string;
      nickname: string;
      phone: string;
      avatar?: string;
      authLogin?: string;
    }>;
    total: number;
  }>({
    url: '/auth/list',
    method: 'GET',
    params,
  });
}
