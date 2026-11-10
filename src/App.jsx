import { Navigate, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intake" element={<Intake />} />
      <Route path="/check" element={<Playback />} />
      <Route path="/shortlist" element={<Shortlist />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/reflect" element={<Reflect />} />
      <Route path="/revised" element={<Revised />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/reviewer" element={<Reviewer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
