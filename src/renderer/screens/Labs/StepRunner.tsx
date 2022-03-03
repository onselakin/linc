import 'renderer/App.css';

import { useRecoilValue } from 'recoil';
import { currentLab } from '../../atoms/labsAtom';
import { Container, Section, Bar } from 'react-simple-resizer';
import Term from 'renderer/components/Scenario/Terminal';
import { useState } from 'react';
import Markdown from '../../components/Scenario/Markdown';

function App() {
  const lab = useRecoilValue(currentLab);
  const scenario = lab!.scenarios[0]!;
  const [size, setSize] = useState(500);

  return (
    <Container className="h-full">
      <Section minSize={500}>
        <div className="h-full overflow-scroll no-scrollbar pr-2 mt-3">
          <Markdown markdown={scenario.steps[0].content!} />
        </div>
      </Section>
      <Bar className="bg-container" size={3} style={{ cursor: 'col-resize' }} />
      <Section minSize={250} onSizeChanged={currentSize => setSize(currentSize)}>
        <Term value={size} />
      </Section>
    </Container>
  );
}

export default App;
