import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CSVDataProvider } from './context/CSVDataContext';
import Layout from './components/Layout/Layout';
import DataUpload from './pages/DataUpload';
import LiveDemo from './pages/LiveDemo';
import ModelPerformance from './pages/ModelPerformance';
import AboutAccuracy from './pages/AboutAccuracy';
import ModelInterpretability from './pages/ModelInterpretability';
import PatternMatching from './pages/PatternMatching';

function App() {
  return (
    <CSVDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DataUpload />} />
            <Route path="live-demo" element={<LiveDemo />} />
            <Route path="model-performance" element={<ModelPerformance />} />
            <Route path="about-accuracy" element={<AboutAccuracy />} />
            <Route path="interpretability" element={<ModelInterpretability />} />
            <Route path="pattern-matching" element={<PatternMatching />} />
          </Route>
        </Routes>
      </Router>
    </CSVDataProvider>
  );
}

export default App;