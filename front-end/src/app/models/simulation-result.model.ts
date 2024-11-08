export interface SimulationResult {
  summary: {
    totalGrowthCones: number;
    simulationSteps: number;
    computationTime: number;
  };
  images: { [key: string]: string };  // Dictionary to hold base64-encoded images with names as keys
}
