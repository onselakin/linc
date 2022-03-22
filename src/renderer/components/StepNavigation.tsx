/* eslint-disable react/require-default-props */
import { To, useNavigate } from 'react-router-dom';
import React from 'react';

type StepNavigationProps = {
  previousTitle?: string;
  nextTitle?: string;
  previousVisible?: boolean;
  nextVisible?: boolean;
  previous: To;
  next: To;
  verifyBeforeNext?: () => Promise<boolean>;
  verifyBeforePrevious?: () => Promise<boolean>;
};

const StepNavigation: React.FC<StepNavigationProps> = ({
  nextTitle = '',
  nextVisible = false,
  previousTitle = false,
  previousVisible = false,
  previous,
  next,
  verifyBeforeNext,
  verifyBeforePrevious,
}) => {
  const navigate = useNavigate();

  const verifyPrevious = () => {
    if (!verifyBeforePrevious) {
      navigate(previous);
      return;
    }

    verifyBeforePrevious()
      .then(result => {
        if (result) navigate(previous);
      })
      .catch();
  };

  const verifyNext = () => {
    if (!verifyBeforeNext) {
      navigate(next);
      return;
    }

    verifyBeforeNext()
      .then(result => {
        if (result) navigate(next);
      })
      .catch();
  };

  return (
    <div className="flex flex-row w-full gap-2 mt-8 text-gray-300 items-center">
      <button
        onClick={verifyPrevious}
        type="button"
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
      </button>
      <button onClick={verifyNext} type="button" className="flex-1 h-16 text-left " disabled={!nextVisible}>
        <div
          className={`rounded bg-container flex flex-row h-16 items-center pl-3 pr-4 border-2 border-orange text-orange  ${
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
