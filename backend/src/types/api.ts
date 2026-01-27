// Réponse de base
export interface ApiResponse {
  success: boolean;
  message: string;
}

// Réponse avec données
export interface ApiResponseWithData<T> extends ApiResponse {
  data: T;
}

// Réponse d'erreur
export interface ApiError extends ApiResponse {
  success: false;
  error?: string;
}