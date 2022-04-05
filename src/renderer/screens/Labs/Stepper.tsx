import { useCurrentLab, useCurrentScenario, useCurrentStep } from 'renderer/hooks/useCurrent';

const Stepper = () => {
  const currentLab = useCurrentLab();
  const currentScenario = useCurrentScenario();
  const currentStep = useCurrentStep();

  return (
    <div className="w-full prose max-w-none mb-6">
      <h1 className="text-sm my-1">{currentScenario.title ? currentScenario.title : currentLab.title}</h1>
      <div className="flex-1 flex justify-between border-t-2 border-gray-500 mt-4">
        {currentScenario.steps.map(step => (
          <div
            className={`w-4 h-4 rounded-full -mt-2 border border-gray-600 ${
              step.id === currentStep.id ? 'bg-green' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
      <div className="text-sm mt-2 text-gray-400">
        Step {currentScenario.steps.indexOf(currentStep) + 1} of {currentScenario.steps.length}
      </div>
    </div>
  );
};

export default Stepper;
