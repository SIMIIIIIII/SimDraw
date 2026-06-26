// Réponse de base
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;

}