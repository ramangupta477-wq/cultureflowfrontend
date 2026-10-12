"use client";

import { createContext, useContext } from "react";

type DeviceTier = "low" | "mid" | "high";

const DeviceTierContext = createContext<DeviceTier>("high");

export function useDeviceTierContext(): DeviceTier {
  return useContext(DeviceTierContext);
}

export { DeviceTierContext };
export type { DeviceTier };
