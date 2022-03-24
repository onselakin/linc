/* eslint-disable react/require-default-props */
import { To, useNavigate } from 'react-router-dom';
import React from 'react';
import { useCurrentLab, useCurrentScenario, useCurrentStep } from '../hooks/useCurrent';

type StepNavigationProps = {
  nextSubtitle?: string;
  nextTitle?: string;
  next?: To;
  verifyBeforeNext?: () => Promise<boolean>;
};

const StepNavigation: React.FC<StepNavigationProps> = ({ nextSubtitle, nextTitle = '', next, verifyBeforeNext }) => {
  const navigate = useNavigate();
  const currentLab = useCurrentLab();
  const currentScenario = useCurrentScenario();
  const currentStep = useCurrentStep();

  const currentStepIdx = currentScenario.steps.indexOf(currentStep);
  const currentScenarioIdx = currentLab.scenarios.indexOf(currentScenario);
  const nextStepAvailable = currentScenario.steps.length > currentStepIdx + 1;
  const nextScenarioAvailable = currentLab.scenarios.indexOf(currentScenario) < currentLab.scenarios.length - 1;

  let subtitle = '';
  let title: string;
  let to: To = '';

  if (nextSubtitle && nextTitle && next) {
    subtitle = nextSubtitle;
    title = nextTitle;
    to = next;
  } else if (nextStepAvailable) {
    subtitle = 'Next Step';
    title = currentScenario.steps[currentStepIdx + 1].title;
    to = `/lab/${currentLab.id}/scenario/${currentScenario.id}/step/${currentScenario.steps[currentStepIdx + 1].id}`;
  } else if (nextScenarioAvailable) {
    const nextScenario = currentLab.scenarios[currentScenarioIdx + 1];
    subtitle = 'Next Scenario';
    title = nextScenario.title;
    to = `/lab/${currentLab.id}/scenario/${nextScenario.id}`;
  } else {
    title = 'Complete Lab';
    to = `/lab/${currentLab.id}/complete`;
  }

  const verifyNext = () => {
    if (!verifyBeforeNext) {
      if (next) navigate(next);
      return;
    }

    verifyBeforeNext()
      .then(result => {
        if (result) navigate(to);
      })
      .catch();
  };

  return (
    <div className="flex w-full mt-8 justify-end">
      <button onClick={verifyNext} type="button" className="w-1/2 h-16 text-left">
        <div className="rounded bg-container flex flex-row h-16 items-center pl-3 pr-4 border-2 border-orange text-orange">
          <div className="flex-1">
            <p className="text-gray-400 text-xs mb-1">{subtitle}</p>
            <p className="text-gray-300 text-md">{title}</p>
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
