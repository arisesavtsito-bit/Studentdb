export interface UtilisateurAuth {
  id: number;
  email: string;
}

export interface ReponseApi<T> {
  success: boolean;
  data: T;
  message?: string;
}
