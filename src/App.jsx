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

// Option screens need intake answers to build from.
function HasAnswers({ children }) {
  const [state] = useStore();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intake" element={<Intake />} />
      <Route path="/check" element={<Playback />} />
      <Route path="/shortlist" element={<HasAnswers><Shortlist /></HasAnswers>} />
      <Route path="/compare" element={<HasAnswers><Compare /></HasAnswers>} />
      <Route path="/explore" element={<HasAnswers><Explore /></HasAnswers>} />
      <Route path="/reflect" element={<HasAnswers><Reflect /></HasAnswers>} />
      <Route path="/revised" element={<HasAnswers><Revised /></HasAnswers>} />
      <Route path="/summary" element={<HasAnswers><Summary /></HasAnswers>} />
      {/* Staff only, not linked from student screens. Optional: edits there change what students see. */}
      <Route path="/reviewer" element={<Reviewer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
