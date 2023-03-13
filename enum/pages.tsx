export enum PagePaths {
  // not require auth
  login = "/login",
  register = "/register",

  // require auth <-> exist userStatus
  home = "/",
  myPosts = "/myPosts",
  editPost = "/editPost/", // subfix : postId
  createPost = "/createPost",
  profile = "/profile/", // subfix : username
  editProfile = "/editProfile",
  myAppointments = "/myAppointments/", // suffix : appointmentId

  // admin
  adminHome = "/admin/", // subfix : user_id

  createAppointment = "/createAppointment", // subfix : postId
}
