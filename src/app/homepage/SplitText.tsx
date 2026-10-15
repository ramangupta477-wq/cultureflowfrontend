"use client";

import React from "react";

interface SplitTextProps {
  text: string;
  by?: "words" | "letters" | "lines";
  className?: string;
}

export default function SplitText({ text, className = "" }: SplitTextProps) {
  return <span className={className}>{text}</span>;
}
