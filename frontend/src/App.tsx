import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 导入所有实际页面组件
import Home from './pages/Home';
import DongZhuKaiGe from './pages/DongZhuKaiGe';
import YiKouTianTong from './pages/YiKouTianTong';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dongzhu-kaige" element={<DongZhuKaiGe />} />
        <Route path="/yi-kou-tian-tong" element={<YiKouTianTong />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
