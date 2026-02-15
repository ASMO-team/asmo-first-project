import React from 'react';
import cn from 'classnames';

type ToggleSwitchProps = {
  isOn: boolean;
  handleToggle: () => void;
};

const ToggleSwitch = ({ isOn, handleToggle }: ToggleSwitchProps) => {
  // Базовые классы
  const containerClasses = cn(
    'relative inline-flex items-center w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300',
    {
      'bg-green-600': isOn,
      'bg-gray-400': !isOn
    }
  );

  const sliderClasses = cn(
    'bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center',
    {
      'translate-x-7': isOn,
      'translate-x-0': !isOn
    }
  );

  const innerDotClasses = cn(
    'w-3 h-3 rounded-full',
    {
      'bg-green-600': isOn,
      'bg-gray-400': !isOn
    }
  );

  return (
    <div 
      className={containerClasses}
      onClick={handleToggle}
    >
      {/* Ползунок с иконками */}
      <div className={sliderClasses}>
        <div className={innerDotClasses} />
      </div>
    </div>
  );
};

export default ToggleSwitch;