import { ProveedorAutenticacion, useAutenticacion } from './context/AuthContext';
import { ProveedorArbol } from './context/ArbolContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';

const ContenidoApp = () => {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) return <div className="cargando">Cargando...</div>;
  if (!usuario) return <Login />;

  return (
    <ProveedorArbol>
      <Layout />
    </ProveedorArbol>
  );
};

function App() {
  return (
    <ProveedorAutenticacion>
      <ContenidoApp />
    </ProveedorAutenticacion>
  );
}

export default App;
