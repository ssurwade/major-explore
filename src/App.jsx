import { Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from './state/store.jsx';
import Landing from './screens/Landing.jsx';
import Intake from './screens/Intake.jsx';
import Playback from './screens/Playback.jsx';
import Shortlist from './screens/Shortlist.jsx';
import Compare from './screens/Compare.jsx';
import Explore from './screens/Explore.jsx';
import Reflect from './screens/Reflect.jsx';
import Revised from './screens/Revised.jsx';
import Summary from './screens/Summary.jsx';
import Reviewer from './screens/Reviewer.jsx';

// Students only see options after a reviewer releases them.
function Released({ children }) {
  const [state] = useStore();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  if (!state.released) return <Navigate to="/check" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intake" element={<Intake />} />
      <Route path="/check" element={<Playback />} />
      <Route path="/shortlist" element={<Released><Shortlist /></Released>} />
      <Route path="/compare" element={<Released><Compare /></Released>} />
      <Route path="/explore" element={<Released><Explore /></Released>} />
      <Route path="/reflect" element={<Released><Reflect /></Released>} />
      <Route path="/revised" element={<Released><Revised /></Released>} />
      <Route path="/summary" element={<Released><Summary /></Released>} />
      {/* Staff only: not linked from any student screen. */}
      <Route path="/reviewer" element={<Reviewer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
