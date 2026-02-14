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
import Proof from './rb/proof/Proof';

import { ProjectProvider } from './rb/ProjectContext';

function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/rb/01-problem" replace />} />
          <Route path="/rb" element={<PremiumLayout />}>
            <Route path="01-problem" element={<Problem />} />
            <Route path="02-market" element={<Market />} />
            <Route path="03-architecture" element={<Architecture />} />
            <Route path="04-hld" element={<HLD />} />
            <Route path="05-lld" element={<LLD />} />
            <Route path="06-build" element={<Build />} />
            <Route path="07-test" element={<Test />} />
            <Route path="08-ship" element={<Ship />} />
            <Route path="proof" element={<Proof />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  );
}

export default App;
