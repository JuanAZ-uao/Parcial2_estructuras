import { useAutenticacion } from '../context/AuthContext';
import '../styles/header.css';

export const Header = () => {
  const { usuario, cerrarSesion } = useAutenticacion();

  return (
    <header className="encabezado">
      <h1 className="encabezado-titulo">Gestor de Archivos</h1>
      <div className="encabezado-usuario">
        <span>{usuario?.email}</span>
        <button className="boton-cerrar" onClick={cerrarSesion}>
          Cerrar Sesion
        </button>
      </div>
    </header>
  );
};
