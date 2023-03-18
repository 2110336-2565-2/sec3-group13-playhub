export enum PAGE_PATHS {
  // not require auth
  LOGIN = "/login",
  REGISTER = "/register",

  // require auth <-> exist userStatus
  HOME = "/",
  MY_POSTS = "/myPosts",
  POST = "/post/", // subfix : postId
  EDIT_POST = "/editPost/", // subfix : postId
  CREATE_POST = "/createPost",
  MY_PROFILE = "/profile/", // subfix : user_id
  EDIT_PROFILE = "/editProfile",
  VERIFY = "/verify",
  RESET_PASSWORD = "/resetPassword",
  SUCCESS_RESET_PASSWORD = "/successResetPassword",
  REQUEST_RESET_PASSWORD = "/requestResetPassword",
  SUCCESS_REQUEST_RESET_PASSWORD = "/successRequestResetPassword",

  // admin
  ADMIN_HOME = "/admin/", // subfix : user_id
  ADMIN_PROFILE = "/admin/profile/", // subfix : user_id
}
