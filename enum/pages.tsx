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
  resetPassword = "/resetPassword",
  successResetPassword = "/successResetPassword",

  // admin
  adminHome = "/admin/", // subfix : user_id
}
