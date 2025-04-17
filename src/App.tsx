import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 导入你的页面组件
import Home from './pages/home';
import Draw from './pages/draw';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draw/:fileId" element={<Draw />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;