export type DetectionEvent = {
  id: string;
  timestamp: string; // ISO
  lat: number;
  lon: number;
  class: string;
  score: number;
};

export type DetectionResult = {
  boxes: Array<[number, number, number, number]>;
  classes: string[];
  scores: number[];
};
