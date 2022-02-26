import {
	axiosWithoutToken as axios,
	axiosWithToken as authAxios
} from 'utils/axios';

/*
|-------------------------------------------------------------------------------
| Auth Login
|-------------------------------------------------------------------------------
*/
export const loginService = async data => await axios().post(`LoginController`,data);

/*
|-------------------------------------------------------------------------------
| Forgot Password
|-------------------------------------------------------------------------------
*/
export const forgotPassword = async data => await axios().post(`ForgotPassword`,data);

/*
|-------------------------------------------------------------------------------
| Reset Password
|-------------------------------------------------------------------------------
*/
export const resetPassword = async data => await axios().post(`ResetPassword`,data);
/*
|-------------------------------------------------------------------------------
| Auth
|-------------------------------------------------------------------------------
*/
export const auth = async (token) => await authAxios(token).get(`Auth`);

/*
|-------------------------------------------------------------------------------
| Verify Email
|-------------------------------------------------------------------------------
*/
export const verifyEmail = async data => await axios().post(`VerifyUserEmail`,data);

