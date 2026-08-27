export type UserRole = 'admin' | 'provider' | 'user';
export type ProviderType = 'seller' | 'rental' | 'both';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  providerType?: ProviderType;
  emailVerified: boolean;
  createdAt: string;
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}
