import helpImage from '../../../../assets/help.jpg';
import importingMd from '../../../../assets/help/importing.md';
import installingDockerMd from '../../../../assets/help/installing-docker.md';
import localClusterMd from '../../../../assets/help/local-cluster.md';
import publishingMd from '../../../../assets/help/publishing.md';
import Markdown from '../../components/Markdown';
import { useState } from 'react';

const HelpIndex = () => {
  const [currentContent, setCurrentContent] = useState(importingMd);

  const itemClick = (markdown: string) => {
    setCurrentContent(markdown);
  };

  return (
    <div className="h-full flex m-4">
      <div className="w-72 shrink-0">
        <div className="text-white flex flex-col bg-container">
          <div className="h-36 overflow-hidden grid place-content-center rounded-t">
            <img className="object-cover rounded mb-3" src={helpImage} alt="help" />
          </div>
          <div className="flex flex-col p-5 pt-3 my-3 rounded">
            <div className="flex flex-row items-center text-md">
              <i className="fa-solid fa-book fa-sm text-[#FFB543] w-5" />
              <div className="flex-1 text-orange">Working with Virtual Labs</div>
            </div>
            <div className="w-full mt-1 relative">
              <div className="absolute bg-green h-0.5" style={{ width: '100%' }} />
            </div>
            <div className="mt-3">
              <button className="mt-3" type="button" onClick={() => itemClick(publishingMd)}>
                <i className="fa-solid fa-circle-dot fa-sm text-gray-400 hover:text-green" />
                <span className="text-sm text-gray-300 ml-2">Publishing your virtual lab</span>
              </button>
              <button className="mt-3" type="button" onClick={() => itemClick(importingMd)}>
                <i className="fa-solid fa-circle-dot fa-sm text-gray-400 hover:text-green" />
                <span className="text-sm text-gray-300 ml-2">Importing virtual labs</span>
              </button>
            </div>

            <div className="flex flex-row items-center text-md mt-5">
              <i className="fa-solid fa-book fa-sm text-[#FFB543] w-5" />
              <div className="flex-1 text-orange">Installing Required Software</div>
            </div>
            <div className="w-full mt-1 relative">
              <div className="absolute bg-green h-0.5" style={{ width: '100%' }} />
            </div>
            <div className="mt-3">
              <button className="mt-3" type="button" onClick={() => itemClick(installingDockerMd)}>
                <i className="fa-solid fa-circle-dot fa-sm text-gray-400 hover:text-green" />
                <span className="text-sm text-gray-300 ml-2">Installing Docker</span>
              </button>
              <button className="mt-3" type="button" onClick={() => itemClick(localClusterMd)}>
                <i className="fa-solid fa-circle-dot fa-sm text-gray-400 hover:text-green" />
                <span className="text-sm text-gray-300 ml-2">Creating a local cluster</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-scroll no-scrollbar px-4 pb-4">
        <Markdown markdown={currentContent} />
      </div>
    </div>
  );
};

export default HelpIndex;
