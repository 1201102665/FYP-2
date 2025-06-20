import React from 'react';

interface Step {
  id: string;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface CheckoutProgressProps {
  steps: Step[];
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ steps }) => {
  return (
    <div className="py-4" data-id="qd9qt85kk" data-path="src/components/CheckoutProgress.tsx">
      <div className="flex items-center justify-between w-full" data-id="aglrq8bi5" data-path="src/components/CheckoutProgress.tsx">
        {steps.map((step, stepIdx) =>
        <React.Fragment key={step.id} data-id="pyktcukc1" data-path="src/components/CheckoutProgress.tsx">
            {/* Step circle */}
            <div
            className={`flex flex-col items-center ${
            stepIdx !== steps.length - 1 ? 'w-full' : ''}`
            } data-id="jjup4xauv" data-path="src/components/CheckoutProgress.tsx">

              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full 
                ${step.status === 'complete' ? 'bg-aerotrav-blue text-white' :
            step.status === 'current' ? 'border-2 border-aerotrav-blue text-aerotrav-blue' :
            'border-2 border-gray-300 text-gray-300'}
              `} data-id="kis0tj55a" data-path="src/components/CheckoutProgress.tsx">
                {step.status === 'complete' ?
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="4sqtr1col" data-path="src/components/CheckoutProgress.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" data-id="mh2qhf185" data-path="src/components/CheckoutProgress.tsx"></path>
                  </svg> :

              <span className="text-sm font-medium" data-id="iurgtasis" data-path="src/components/CheckoutProgress.tsx">{stepIdx + 1}</span>
              }
              </div>
              
              {/* Step name */}
              <span className={`mt-2 text-xs font-medium ${
            step.status === 'complete' ? 'text-aerotrav-blue' :
            step.status === 'current' ? 'text-aerotrav-blue' :
            'text-gray-500'}`
            } data-id="ey6dk4jon" data-path="src/components/CheckoutProgress.tsx">
                {step.name}
              </span>
            </div>
            
            {/* Connector line */}
            {stepIdx < steps.length - 1 &&
          <div className="flex-grow mx-1" data-id="n437jlsp1" data-path="src/components/CheckoutProgress.tsx">
                <div className={`h-0.5 ${
            steps[stepIdx + 1].status === 'upcoming' && step.status === 'upcoming' ?
            'bg-gray-300' :
            steps[stepIdx + 1].status === 'upcoming' ?
            'bg-gradient-to-r from-aerotrav-blue to-gray-300' :
            'bg-aerotrav-blue'}`
            } data-id="if38pu2s3" data-path="src/components/CheckoutProgress.tsx"></div>
              </div>
          }
          </React.Fragment>
        )}
      </div>
    </div>);

};

export default CheckoutProgress;