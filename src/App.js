// src/App.js
import { AuthProvider } from './contexts/AuthContext'
import Register from './pages/Register' // สมมติเราจะแสดงหน้า Register

function App() {
  return (
    <AuthProvider>
      {/* โค้ดอื่นๆ และ Router ของคุณจะอยู่ตรงนี้ */}
      <Register /> 
    </AuthProvider>
  )
}

export default App