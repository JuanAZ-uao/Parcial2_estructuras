import { useState, type FormEvent } from 'react';
import { useAutenticacion } from '../context/AuthContext';
import '../styles/login.css';

export const Login = () => {
  const { registrar, iniciarSesion } = useAutenticacion();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (esRegistro) {
        await registrar(correo, contrasena);
      } else {
        await iniciarSesion(correo, contrasena);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <div className="login-contenedor">
      <div className="login-tarjeta">
        <h2>{esRegistro ? 'Registrarse' : 'Iniciar Sesion'}</h2>
        <form onSubmit={manejarEnvio}>
          <div className="campo">
            <label>Correo electronico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="campo">
            <label>Contrasena</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="boton-primario">
            {esRegistro ? 'Registrarse' : 'Iniciar Sesion'}
          </button>
        </form>
        <button
          className="boton-alternar"
          onClick={() => setEsRegistro(!esRegistro)}
        >
          {esRegistro ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
        </button>
      </div>
    </div>
  );
};
