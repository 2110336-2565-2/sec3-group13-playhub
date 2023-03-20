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

  MY_APPOINTMENTS = "/myAppointments",
  SELECT_APPOINTMENT = "/selectAppointment",
  CONFIRM_APPOINTMENT = "/confirmAppointment", //suffix : appointmentId
  CREATE_APPOINTMENT = "/createAppointment", // subfix : postId

  // home = "/",
  // myPosts = "/myPosts",
  // editPost = "/editPost/", // subfix : postId
  // createPost = "/createPost",
  // profile = "/profile/", // subfix : user_id
  // editProfile = "/editProfile",
  // selectApptToConfirm = "/selectApptToConfirm",
  // confirmAppt = "/confirmAppt/",
  // myAppointments = "/myAppointments/", // suffix : appointmentId
  // createAppointment = "/createAppointment", 
  // verify = "/verify",
  // resetPassword = "/resetPassword",
  // successResetPassword = "/successResetPassword",
  // requestResetPassword = "/requestResetPassword",
  // successRequestResetPassword = "/successRequestResetPassword",

  // admin
  ADMIN_HOME = "/admin/", // subfix : user_id
  ADMIN_PROFILE = "/admin/profile/", // subfix : user_id
}
