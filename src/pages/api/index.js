export const HEADER_BASE = {
  "content-type": "application/json",
  "Accept-Language": "fr-IR,fr;q=0.5",
};

// mrx : base url
export const BASE_URL = `https://eqmath-server.iran.liara.run/api`;

// mrx : base image url
export const BASE_Image_Url = `https://qb.omidgolestani.ir/`;

// mrx : login user
export const LOGIN_USER = `${BASE_URL}/users/login`;

// mrx : create user
export const CREATE_USER = `${BASE_URL}/users/create-user`;

// mrx : get all users
export const GET_ALL_USERS = `${BASE_URL}/users`;

// mrx : get user by id
export const GET_USER_BY_ID = (UserID) => `${BASE_URL}/users/${UserID}`;

// mrx : delete user by id
export const DELETE_USER_BY_ID = (UserID) => `${BASE_URL}/users/delete-user/${UserID}`;

// mrx : update user by id
export const UPDATE_USER_BY_ID = (UserID) => `${BASE_URL}/users/edit-user/${UserID}`;

// mrx : update user profile by id
export const UPLOAD_USER_PROFILE = (UserID) => `${BASE_URL}/users/upload-profile/${UserID}`;

// mrx: create blog 
export const CREATE_BLOG = `${BASE_URL}/blogs/create-blog`;

// mrx: get blog list
export const GET_BLOG_LIST = `${BASE_URL}/blogs`;

// mrx: get blog list
export const GET_BLOG_BY_ID = (BlogID) => `${BASE_URL}/blogs/${BlogID}`;

// mrx: Edit blog buy id
export const EDIT_BLOG_BY_ID = (BlogID) => `${BASE_URL}/blogs/edit-blog/${BlogID}`;

// mrx: delete blog by id
export const DELETE_BLOG_BY_ID = (BlogID) => `${BASE_URL}/blogs/delete-blog/${BlogID}`;

// mrx: upload blog cover 
export const UPLOAD_BLOG_COVER = (BlogID) => `${BASE_URL}/blogs/upload-blog-cover/${BlogID}`;