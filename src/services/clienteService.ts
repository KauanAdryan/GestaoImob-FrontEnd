import { api } from './api';

export interface ClienteAPI {
  id: string;
  nome: string;
  agencia: number;
  conta: number;
}

export interface ClientePayload {
  nome: string;
  agencia: number;
  conta: number;
}

type PageResponse<T> = { content: T[] };
type ListResponse<T> = { clientes: T[] };

function toArray<T>(data: T[] | PageResponse<T> | ListResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as PageResponse<T>).content))   return (data as PageResponse<T>).content;
  if (data && Array.isArray((data as ListResponse<T>).clientes))  return (data as ListResponse<T>).clientes;
  return [];
}

export const clienteService = {
  getAll:  ()                          => api.get<ClienteAPI[] | PageResponse<ClienteAPI> | ListResponse<ClienteAPI>>('/clientes').then(toArray),
  getById: (id: string)                => api.get<ClienteAPI>(`/clientes/${id}`),
  create:  (payload: ClientePayload)   => api.post<ClienteAPI>('/clientes', payload),
  update:  (id: string, payload: ClientePayload) => api.put<ClienteAPI>(`/clientes/${id}`, payload),
  delete:  (id: string)                          => api.delete<void>(`/clientes/${id}`),
};
