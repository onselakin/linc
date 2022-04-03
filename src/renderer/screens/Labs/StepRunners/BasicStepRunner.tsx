/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { Container, Section } from 'react-simple-resizer';
import { useCurrentStep } from 'renderer/hooks/useCurrent';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';

const BasicStepRunner = () => {
  const currentStep = useCurrentStep();

  return (
    <Container className="h-full">
      <Section minSize={500}>
        <div className="h-full overflow-scroll no-scrollbar pr-2">
          <Markdown markdown={currentStep.content} includes={currentStep.includes} />

          <div className="my-4">
            <StepNavigation verifyBeforeNext={() => Promise.resolve(true)} />
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default BasicStepRunner;
