export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataToStoredInToken {
  _id: string;
  email: string;
  isAdmin: boolean;
}
