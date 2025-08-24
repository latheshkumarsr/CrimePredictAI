import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Models from './pages/Models';
import DatasetUpload from './pages/DatasetUpload';
import About from './pages/About';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="dataset-upload" element={<DatasetUpload />} />
            <Route path="models" element={<Models />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;