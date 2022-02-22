/* eslint-disable react/no-array-index-key */
import 'renderer/App.css';

import { MarkDownStep, XTermSection } from 'types/scenario';

import Markdown from '../../components/Scenario/Markdown';
import XTerm from '../../components/Scenario/XTerm';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';

function App() {
  const { labId, scenarioId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.find(l => l.id === labId);
  const scenario = lab?.scenarios.find(s => s.id === scenarioId);

  return (
    <div className="ml-4">
      <h1>{scenario?.title}</h1>

      {scenario?.steps.map((step, idx) => {
        switch (step.type) {
          case 'markdown':
            return <Markdown markdown={step as MarkDownStep} key={idx} />;
          default:
            return <XTerm configuration={step as XTermSection} key={idx} />;
        }
      })}
    </div>
  );
}

export default App;
