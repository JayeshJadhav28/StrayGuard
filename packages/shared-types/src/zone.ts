export type DangerZone = {
  id: string;
  name: string;
  geomGeoJson: any;
  recommendedSpeed: number;
  riskLevel: 'low' | 'medium' | 'high';
};

export type ZoneResponse = DangerZone[];

export type RiskLevel = 'low' | 'medium' | 'high';
