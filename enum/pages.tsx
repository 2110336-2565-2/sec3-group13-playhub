export enum PagePaths {
  // not require auth
  login = "/login",
  register = "/register",

  // require auth <-> exist userStatus
  home = "/",
  myPosts = "/myPosts",
  editPost = "/editPost/", // subfix : postId
  createPost = "/createPost",
  profile = "/profile/", // subfix : user_id
  editProfile = "/editProfile",
  myAppointments = "/myAppointments/", // suffix : appointmentId
  createAppointment = "/createAppointment", // subfix : postId
  verify = "/verify",
  resetPassword = "/resetPassword",
  successResetPassword = "/successResetPassword",
  requestResetPassword = "/requestResetPassword",
  successRequestResetPassword = "/successRequestResetPassword",

  // admin
  adminHome = "/admin/", // subfix : user_id
  adminProfile = "/admin/profile/" // subfix : user_id
}
