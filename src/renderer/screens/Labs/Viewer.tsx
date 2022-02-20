import 'renderer/App.css';

import Scenario, { MarkDownSection, XTermSection } from 'types/scenario';
import { useEffect, useState } from 'react';

import Markdown from '../../components/Scenario/Markdown';
import XTerm from '../../components/Scenario/XTerm';

function App() {
  const [scenario] = useState<Scenario>();

  useEffect(() => {
    async function readRepos() {
      return '';
    }

    readRepos();
  }, []);

  return (
    <div>
      <h1>{scenario?.title}</h1>

      {scenario?.sections.map(section => {
        switch (section.type) {
          case 'markdown':
            return <Markdown markdown={section as MarkDownSection} />;
          default:
            return <XTerm configuration={section as XTermSection} />;
        }
      })}
    </div>
  );
}

export default App;
