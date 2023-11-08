export type UserProfile = {
  id?: string;
  email?: string;
  name?: string;
  password?: string;
  username: string;
  bio: string;
  profileImg: string;
  phoneNo: string;
  address: string;
  gender: string;
  isEmailVerified?: boolean;
  hash?: string | null;
};
