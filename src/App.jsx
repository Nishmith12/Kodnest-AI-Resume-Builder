import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PremiumLayout from './rb/PremiumLayout';
import Problem from './rb/steps/Problem';
import Market from './rb/steps/Market';
import Architecture from './rb/steps/Architecture';
import HLD from './rb/steps/HLD';
import LLD from './rb/steps/LLD';
import Build from './rb/steps/Build';
import Test from './rb/steps/Test';
import Ship from './rb/steps/Ship';
import ProofRB from './rb/proof/Proof';

import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Proof from './pages/Proof';

import { ProjectProvider } from './rb/ProjectContext';

function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Routes>
          {/* Core Application Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/proof" element={<Proof />} />

          {/* Educational Track Routes (Preserved) */}
          <Route path="/rb" element={<PremiumLayout />}>
            <Route path="01-problem" element={<Problem />} />
            <Route path="02-market" element={<Market />} />
            <Route path="03-architecture" element={<Architecture />} />
            <Route path="04-hld" element={<HLD />} />
            <Route path="05-lld" element={<LLD />} />
            <Route path="06-build" element={<Build />} />
            <Route path="07-test" element={<Test />} />
            <Route path="08-ship" element={<Ship />} />
            <Route path="proof" element={<ProofRB />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  );
}

export default App;
