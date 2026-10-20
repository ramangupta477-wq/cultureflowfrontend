"use client";

import React from "react";
import styled from "styled-components";

const CultureFlowLoader: React.FC = () => {
  return (
    <StyledWrapper>
      {/* 1. Vortex Loader */}
      <div className="vortex-loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  /* --- 1. Vortex Loader --- */
  .vortex-loader {
    width: 12.25rem;
    height: 12.25rem;
    border: 0.4375rem #002244 solid;
    border-radius: 1.225rem;
    overflow: hidden;
    position: relative;
  }

  .vortex-loader:after, .vortex-loader:before {
    content: '';
    border-radius: 50%;
    position: absolute;
    width: inherit;
    height: inherit;
    animation: spVortex 2s infinite linear;
  }

  .vortex-loader:before {
    border-top: 1.575rem #050A30 solid;
    top: -0.7875rem;
    left: calc( -50% - 0.7875rem );
    transform-origin: right center;
  }

  .vortex-loader:after {
    border-bottom: 1.575rem #002244 solid;
    top: 0.7875rem;
    right: calc( -50% - 0.7875rem );
    transform-origin: left center;
  }

  @keyframes spVortex {
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
  }
`;

export default CultureFlowLoader;
