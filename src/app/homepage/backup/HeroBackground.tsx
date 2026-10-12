"use client";

import React from 'react';
import styled from 'styled-components';

const HeroBackground = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0; /* Keep at 0 so it doesn't fall behind the app root */
  overflow: hidden;

  .container {
    position: absolute;
    inset: 0;
  }

  .container::before {
    content: "";
    position: absolute;
    inset: 0;
    /* SVG data URI customized for the light professional theme */
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='19.5' numOctaves='10' result='turbulence'/%3E%3CfeComposite operator='in' in='turbulence' in2='SourceAlpha' result='composite'/%3E%3CfeColorMatrix in='composite' type='luminanceToAlpha'/%3E%3CfeBlend in='SourceGraphic' in2='composite' mode='multiply'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23a)'%3E%3Cpath fill='%23F6EEDD' d='M0 0h100v100H0z'/%3E%3Cpath d='M0 0v100h100V0Z' stroke-width='2' stroke='%23002244' stroke-opacity='0.05' fill='none'/%3E%3Cpath fill='%23002244' fill-opacity='0.03' d='M50 0h1v100h-1z'/%3E%3Cpath fill='%23002244' fill-opacity='0.03' d='M0 50h100v1H0z'/%3E%3C/g%3E%3C/svg%3E");
    
    /* Fades the pattern slightly at the bottom so it blends with the rest of the site */
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0.1) 100%);
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0.1) 100%);
  }
`;

export default HeroBackground;
