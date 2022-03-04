import 'renderer/App.css';

import { useRecoilValue } from 'recoil';
import { currentLab } from 'renderer/atoms/labsAtom';
import { Container, Section, Bar } from 'react-simple-resizer';
import Term from 'renderer/components/Terminal';
import { useState } from 'react';
import Markdown from 'renderer/components/Markdown';

function StepRunner() {
  const lab = useRecoilValue(currentLab);
  const scenario = lab!.scenarios[0]!;
  const [size, setSize] = useState(500);

  return (
    <Container className="h-full">
      <Section minSize={500}>
        <div className="h-full overflow-scroll no-scrollbar pr-2">
          <Markdown markdown={scenario.steps[0].content!} />
        </div>
      </Section>
      <Bar className="bg-container" size={3} style={{ cursor: 'col-resize' }} />
      <Section minSize={250} onSizeChanged={currentSize => setSize(currentSize)}>
        <div className="h-full flex flex-col">
          <div className="h-8 rounded-tl rounded-tr bg-container font-mono text-gray-300 flex flex-row pl-4 gap-8">
            <button
              type="button"
              className="bg-container h-7 items-center px-4 flex flex-row gap-2 border-b-2 border-green text-sm"
            >
              <i className="fa-solid fa-terminal fa-sm" />
              <p>bash</p>
            </button>
            <button type="button" className="bg-container h-7 items-center px-4 flex flex-row gap-2">
              <i className="fa-solid fa-terminal fa-sm" />
              <p>bash</p>
            </button>
            <button type="button" className="bg-container h-7 items-center px-4 flex flex-row gap-2 align-self-end">
              <i className="fa-solid fa-terminal fa-sm" />
            </button>
          </div>
          <div className="flex-1 bg-black">
            <Term value={size} />
          </div>
        </div>
      </Section>
    </Container>
  );
}

export default StepRunner;
