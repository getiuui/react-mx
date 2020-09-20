const checkIfMobile = userAgent =>
  Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))

export const userAgentData = {
  userAgent: null,
  isMobile: false
}

export const initUserAgent = req => {
  if (req) {
    userAgentData.userAgent = req.headers['user-agent'] // get the user-agent from the headers
  } else {
    userAgentData.userAgent = navigator.userAgent
  }
  userAgentData.isMobile = checkIfMobile(userAgentData.userAgent)
}

export const setUserAgentData = uaData => {
  userAgentData.userAgent = uaData.userAgent
  userAgentData.isMobile = uaData.isMobile
}

export default userAgentData
