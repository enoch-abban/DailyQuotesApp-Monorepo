export interface QueryPayload {
    payload: string;
  }

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ErrorResponse extends Error {
  data: null;
}