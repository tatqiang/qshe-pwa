// src/App.tsx
import Layout from './components/Layout';
import { Outlet } from 'react-router-dom'; // Import Outlet

function App() {
  return (
    <Layout>
      {/* Outlet is where your page components (Dashboard, etc.) will be rendered */}
      <Outlet /> 
    </Layout>
  )
}

export default App