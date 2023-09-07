import Cookies from 'js-cookie'

/* Decode the token to get user details */

function parseJwt(token:string | undefined) {
  if (!token) return;

  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64));
}

const generateUserData = () => {
const decodedToken = parseJwt(Cookies.get('token'))
  
let user = {
  id: "",
  username: "",
  email: "",
  role: ""
}

  if (decodedToken) {
    user = {
      id: decodedToken.JWTID,
      username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    }
  }

  return user
}

export default generateUserData