import './App.css';

import Scenario, { MarkDownSection, XTermSection } from 'model/scenario';
import { useEffect, useState } from 'react';

import Markdown from './scenario/Markdown';
import XTerm from './scenario/XTerm';
import jsyaml from 'js-yaml';

const App = () => {
  const [scenario, setScenario] = useState<Scenario>();

  useEffect(() => {
    async function fetchYaml() {
      fetch('http://127.0.0.1:8080/inline-terminal.yaml')
        .then((res) => res.blob())
        .then((blob) => blob.text())
        .then((yaml) => {
          const loaded = jsyaml.load(yaml) as Scenario;
          setScenario(loaded);
        })
        .catch((err) => console.log('yaml err:', err));
    }
    fetchYaml();
  }, []);

  return (
    <div>
      <h1>{scenario?.title}</h1>

      {scenario?.sections.map((section) => {
        switch (section.type) {
          case 'markdown':
            return <Markdown markdown={section as MarkDownSection} />;
          default:
            return <XTerm configuration={section as XTermSection} />;
        }
      })}
    </div>
  );
};
export default App;
