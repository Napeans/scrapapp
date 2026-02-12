import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BackIcon = ({ size = 28, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M10 6l-6 6 6 6M4 12h16"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackIcon;
