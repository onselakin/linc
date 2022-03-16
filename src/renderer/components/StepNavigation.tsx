/* eslint-disable react/require-default-props */
import { Link, To, useNavigate } from 'react-router-dom';
import React from 'react';

type StepNavigationProps = {
  previousTitle?: string;
  nextTitle?: string;
  previousVisible?: boolean;
  nextVisible?: boolean;
  previous: To;
  next: To;
  verifyProgress?: () => Promise<void>;
};

const StepNavigation: React.FC<StepNavigationProps> = ({
  nextTitle = '',
  nextVisible = '',
  previousTitle = false,
  previousVisible = false,
  previous,
  next,
  verifyProgress,
}) => {
  const navigate = useNavigate();

  const verify = () => {
    if (verifyProgress) {
      verifyProgress()
        .then(() => {
          navigate(next);
        })
        .catch(() => {});
    } else {
      navigate(next);
    }
  };

  return (
    <div className="flex flex-row w-full gap-2 mt-8 text-gray-300 items-center">
      <Link
        to={previous}
        className={`rounded bg-container flex-1 h-16 flex flex-row items-center pl-4 pr-3 ${
          previousVisible ? 'visible' : 'invisible'
        }`}
      >
        <div className="justify-self-end w-4">
          <i className="fa-solid fa-arrow-left" />
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-xs mb-1 text-right">Previous Step</p>
          <p className="text-gray-300 text-md text-right">{previousTitle}</p>
        </div>
      </Link>
      <button onClick={verify} type="button" className="flex-1 h-16 text-left">
        <div
          className={`rounded bg-container flex flex-row h-16 items-center pl-3 pr-4  ${
            nextVisible ? 'visible' : 'invisible'
          }`}
        >
          <div className="flex-1">
            <p className="text-gray-400 text-xs mb-1">Next Step</p>
            <p className="text-gray-300 text-md">{nextTitle}</p>
          </div>
          <div className="justify-self-end w-4">
            <i className="fa-solid fa-arrow-right" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default StepNavigation;
