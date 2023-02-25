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

  // admin
  adminHome = "/admin/", // subfix : user_id
  adminProfile = "/admin/profile/" // subfix : user_id
}
