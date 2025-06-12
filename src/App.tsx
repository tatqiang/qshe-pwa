// src/App.tsx

import Layout from './components/Layout'; // นำเข้า Layout component

function App() {
  return (
    // นำ Layout มาห่อหุ้มเนื้อหาของแอป
    <Layout>
      {/* ในอนาคต เราจะใส่หน้าต่างๆ ของเราไว้ตรงนี้ 
        เช่น หน้า Dashboard, หน้า Incident Report
        แต่ตอนนี้ใส่ข้อความต้อนรับไปก่อน
      */}
      <h2>Welcome to QSHE Management System</h2>
    </Layout>
  )
}

export default App