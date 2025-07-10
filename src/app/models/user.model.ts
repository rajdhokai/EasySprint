export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
}