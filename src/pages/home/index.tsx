import 'dingtalk-jsapi/entry/union';
import ReactDOM from 'react-dom/client';
import { Route, Routes, HashRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import ImageComponent from './image';
import Navbar from './navbar';
import ScanCode from './scan';
import Storage from './storage';
import StorageForm from './form';
import AudioManager from './audio';
import 'tailwindcss/base.css';
import 'tailwindcss/utilities.css';

const { Content } = Layout;

function App() {
  return (
    <StyleProvider hashPriority="high">
      <div style={{ backgroundColor: 'rgba(245,245,245)', overflow: 'auto' }}>
        <HashRouter>
          <Layout>
            <Content className="h-screen p-6">
              <Routes>
                <Route path="/" element={<Navbar />} />
                <Route path="/image" element={<ImageComponent />} />
                <Route path="/scan-code" element={<ScanCode />} />
                <Route path="/storage" element={<Storage />} />
                <Route path="/form" element={<StorageForm />} />
                <Route path="/audio" element={<AudioManager />} />
              </Routes>
            </Content>
          </Layout>
        </HashRouter>
      </div>
    </StyleProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('Root'));
root.render(<App />);
