import {useMemo, useState} from 'react';

export function useScores() {
  const [scores, setScores] = useState<string[]>([]);

  const handleChange = (index: number, value: string) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const reset = (length: number) => {
    setScores(new Array(length).fill('0'));
  };

  const numericScores = useMemo(
    () => scores.map((s) => parseInt(s || '0', 10)),
    [scores],
  );

  return {scores, numericScores, handleChange, reset};
}