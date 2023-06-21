import React from 'react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import {getRandomArray, randomSeedArray} from '../libs/helper'

const RandomAvatar = ({ seed, size='16',className,...rest }) => {
  // Set the seed and gender for the avatar
  const avatar = createAvatar(micah, {
    seed: seed
  });
  const svg = avatar.toString();
  return (
    <div className={`w-${size} ${className || ''}`} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: avatar }} />
    </div>
  );
};

export default RandomAvatar;