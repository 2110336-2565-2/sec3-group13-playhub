export enum PAGE_PATHS {
  // not require auth
  LOGIN = "/login/",
  REGISTER = "/register/",

  // require auth <-> exist userStatus
  HOME = "/",

  MY_POSTS = "/myPosts/",
  POST = "/post/", // subfix : post_id
  EDIT_POST = "/editPost/", // subfix : post_id
  CREATE_POST = "/createPost/",

  PROFILE = "/profile/", // subfix : user_id
  EDIT_PROFILE = "/editProfile/",

  VERIFY = "/verify/",

  RESET_PASSWORD = "/resetPassword/",
  SUCCESS_RESET_PASSWORD = "/successResetPassword/",

  REQUEST_RESET_PASSWORD = "/requestResetPassword/",
  SUCCESS_REQUEST_RESET_PASSWORD = "/successRequestResetPassword/",

  APPOINTMENT = "/appointment/", //suffix : appointment_id
  MY_APPOINTMENTS = "/myAppointments/",
  SELECT_APPOINTMENT = "/selectAppointment/",
  CONFIRM_APPOINTMENT = "/confirmAppointment/", //suffix : appointment_id
  CREATE_APPOINTMENT = "/createAppointment/", // subfix : postId

  SELECT_RATE = "/selectRate/",
  RATE = "/rate/", //suffix : appointment_id

  // admin
  ADMIN_HOME = "/admin/", // subfix : user_id
  ADMIN_PROFILE = "/admin/profile/", // subfix : user_id
}

export enum ROLE {
  HOST = "host/",
  PARTICIPANT = "participant/",
}
