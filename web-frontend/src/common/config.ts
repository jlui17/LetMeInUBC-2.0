const websiteUrl = "https://letmeinubc.com/dashboard";
const clientId = "3n647dbebv2v9r1kchi655p4o7";
export const LOGIN_URL = `https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${websiteUrl}`;
export const SIGNUP_URL = `https://letmeinubc.auth.us-west-2.amazoncognito.com/signup?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${websiteUrl}`;
export const LOGOUT_URL = `https://letmeinubc.auth.us-west-2.amazoncognito.com/logout?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${websiteUrl}`;
export const FORGOT_PASSWORD_URL = `https://letmeinubc.auth.us-west-2.amazoncognito.com/forgotPassword?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${websiteUrl}`;

export const API_GATEWAY_ID = "f9gyamv73d";
