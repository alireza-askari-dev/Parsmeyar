// mrx : cookie
import Cookies from 'js-cookie'

export const makeAuthData = () => ({
    authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
});
