/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { Container, Section } from 'react-simple-resizer';
import { useCurrentStep } from 'renderer/hooks/useCurrent';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import { useEffect, useRef } from 'react';

const BasicStepRunner = () => {
  const currentStep = useCurrentStep();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef?.current?.scroll({ top: 0, behavior: 'smooth' });
  });

  return (
    <Container className="h-full m-4">
      <Section minSize={500}>
        <div ref={contentRef} className="h-full overflow-scroll no-scrollbar pr-2">
          <Markdown markdown={currentStep.content} includes={currentStep.includes} />

          <div className="my-8">
            <StepNavigation verifyBeforeNext={() => Promise.resolve(true)} />
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default BasicStepRunner;
