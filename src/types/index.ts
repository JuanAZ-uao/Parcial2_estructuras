export type TipoNodo = 'carpeta' | 'archivo';

export interface DatosNodo {
  id: string;
  nombre: string;
  tipo: TipoNodo;
  creadoPor: string;
  fechaCreacion: number;
}

export interface NodoSerializado {
  datos: DatosNodo;
  hijos: NodoSerializado[];
}
