export interface BaseResponseGeneric<T> {
  data: T;
  count: number;
  pages: number;
  success: boolean;
  errorMessage: null;
}

export interface Options {
  limit?: number;
  offset?: number;
  searchText?: string;
  uri?: string;
}
