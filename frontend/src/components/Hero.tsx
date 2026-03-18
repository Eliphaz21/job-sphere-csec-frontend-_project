import React from 'react';
import { motion } from 'motion/react';
import honepage from '../assets/honepage.png';

export const Hero = () => (
  <div className="relative h-[620px] overflow-hidden flex items-center">
    {/* Single Large Background Image */}
    <div className="absolute inset-0 z-0">
      <img
        src={honepage}
        alt="picture of the homepage"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  </div>
);
