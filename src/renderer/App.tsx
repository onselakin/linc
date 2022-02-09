import './App.css';

import { useEffect } from 'react';

const App = () => {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          console.log(window.electron.store.settings().courseRepos[0]);
        }}
      >
        Click Me!
      </button>
    </div>
  );
};
export default App;
