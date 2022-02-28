/* eslint-disable react/no-array-index-key */
import 'renderer/App.css';

import { MarkDownStep } from 'types/scenario';

import Markdown from '../../components/Scenario/Markdown';
// import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';
import { Container, Section, Bar } from 'react-simple-resizer';
import Term from 'renderer/components/Scenario/Terminal';
import { useState } from 'react';

function App() {
  // const { labId, scenarioId } = useParams();
  // const labs = useRecoilValue(labsAtom);
  // const lab = labs.find(l => l.id === labId);
  // const scenario = lab?.scenarios.find(s => s.id === scenarioId);

  const labs = useRecoilValue(labsAtom);
  const scenario = labs[0].scenarios[0];
  const [size, setSize] = useState(500);

  return (
    <Container className="h-full">
      <Section minSize={500}>
        <div className="prose lg:prose-l max-w-none p-4">
          <h1>{scenario?.title}</h1>

          {scenario?.steps.map((step, idx) => {
            switch (step.type) {
              case 'markdown':
                return <Markdown markdown={step as MarkDownStep} key={idx} />;
              default:
                return <></>;
            }
          })}
        </div>
      </Section>
      <Bar className="bg-gray-300" size={4} style={{ cursor: 'col-resize' }} />
      <Section minSize={250} onSizeChanged={currentSize => setSize(currentSize)}>
        <Term value={size} />
      </Section>
    </Container>
  );
}

export default App;
