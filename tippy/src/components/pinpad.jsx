import React, { useState } from 'react';

const PinPad = ({ onPinChange, onSubmit, maxLength=4 }) => {
  const [pin, setPin] = useState('');

  const handlePinChange = (value) => {
    if (pin.length < maxLength) {
      const newPin = pin + value;
      setPin(newPin);
      onPinChange && onPinChange(newPin);
    }
  };

  const handlePinBackspace = () => {
    if (pin.length > 0) {
      const newPin = pin.slice(0, -1);
      setPin(newPin);
      onPinChange &&onPinChange(newPin);
    }
  };

  const handlePinSubmit = () => {
    if (pin.length > 0) {
        onSubmit && onSubmit(pin);
    }
  };

  const renderPinButtons = () => {
    const buttons = [];
    for (let i = 1; i <= 9; i++) {
      buttons.push(
        <button
          key={i}
          className="w-16 h-16 border border-gray-300 rounded-md text-xl font-semibold"
          onClick={() => handlePinChange(i.toString())}
        >
          {i}
        </button>
      );
    }
    buttons.push(
      <button
        key={0}
        className="w-16 h-16 border border-gray-300 rounded-md text-xl font-semibold"
        onClick={() => handlePinChange('0')}
      >
        0
      </button>
    );
    buttons.push(
      <button
        key="backspace"
        className="w-16 h-16 border border-gray-300 rounded-md text-xl font-semibold"
        onClick={handlePinBackspace}
      >
        &#9003;
      </button>
    );
    return buttons;
  };

  return (
    <div className="flex flex-col flex-wrap justify-center items-center gap-2">
      <input
        type="password"
        style={{
            letterSpacing: 15
        }}
        className="w-5/6 max-w-xs h-12 border border-gray-300 rounded-md px-2 text-center text-xl font-semibold focus:outline-none"
        value={pin}
        readOnly
      />
      <div className="grid grid-cols-3 gap-2">{renderPinButtons()}</div>
      <button
        className="w-5/6 max-w-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md mt-2"
        onClick={handlePinSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default PinPad;
