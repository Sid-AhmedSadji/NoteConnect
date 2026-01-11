import User from 'models/User'

export type SortOption = 'name' | 'date' | 'note';
export type FilterOption = 'all' | 'liked' | 'active' | 'dead';
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
