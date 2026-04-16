import type { DatosNodo } from '../types';

export class NodoArbol {
  datos: DatosNodo;
  hijos: NodoArbol[];

  constructor(datos: DatosNodo) {
    this.datos = datos;
    this.hijos = [];
  }

  esArchivo(): boolean {
    return this.datos.tipo === 'archivo';
  }

  esCarpeta(): boolean {
    return this.datos.tipo === 'carpeta';
  }

  agregarHijo(hijo: NodoArbol): void {
    if (this.esArchivo()) {
      throw new Error('Un archivo no puede tener hijos');
    }
    this.hijos.push(hijo);
  }

  eliminarHijo(id: string): boolean {
    const longitudOriginal = this.hijos.length;
    this.hijos = this.hijos.filter(hijo => hijo.datos.id !== id);
    return this.hijos.length !== longitudOriginal;
  }

  buscarNodo(id: string): NodoArbol | null {
    if (this.datos.id === id) return this;

    for (const hijo of this.hijos) {
      const encontrado = hijo.buscarNodo(id);
      if (encontrado) return encontrado;
    }

    return null;
  }

  buscarPadre(id: string): NodoArbol | null {
    for (const hijo of this.hijos) {
      if (hijo.datos.id === id) return this;
      const encontrado = hijo.buscarPadre(id);
      if (encontrado) return encontrado;
    }
    return null;
  }
}
