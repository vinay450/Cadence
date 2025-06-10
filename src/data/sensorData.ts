export interface SensorData {
  timestamp: string
  deviceId: string
  temperature: number
  vibration: number
  pressure: number
  powerConsumption: number
  status: 'normal' | 'warning' | 'critical'
  anomalyType?: 'temperature' | 'vibration' | 'pressure' | 'power' | 'multiple'
}

// Fixed seed random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Helper function to generate random number within range with seed
const randomInRange = (min: number, max: number, seed: number) => {
  return seededRandom(seed) * (max - min) + min
}

// Helper function to generate timestamp
const generateTimestamp = (index: number) => {
  const date = new Date('2024-01-01T00:00:00')
  date.setMinutes(date.getMinutes() + index * 15) // 15-minute intervals
  return date.toISOString()
}

// Generate normal sensor readings
const generateNormalReadings = (index: number): SensorData => {
  return {
    timestamp: generateTimestamp(index),
    deviceId: `DEV-${Math.floor(index / 100) + 1}`,
    temperature: randomInRange(65, 75, index * 1.1), // Normal temperature range
    vibration: randomInRange(0.1, 0.3, index * 1.2), // Normal vibration range
    pressure: randomInRange(80, 90, index * 1.3), // Normal pressure range
    powerConsumption: randomInRange(45, 55, index * 1.4), // Normal power consumption
    status: 'normal'
  }
}

// Generate anomaly patterns
const generateAnomaly = (index: number): SensorData => {
  const anomalyTypes = ['temperature', 'vibration', 'pressure', 'power', 'multiple']
  const anomalyType = anomalyTypes[Math.floor(seededRandom(index * 1.5) * anomalyTypes.length)] as SensorData['anomalyType']
  
  const baseData = generateNormalReadings(index)
  
  switch (anomalyType) {
    case 'temperature':
      return {
        ...baseData,
        temperature: randomInRange(85, 95, index * 1.6), // High temperature
        status: 'critical',
        anomalyType
      }
    case 'vibration':
      return {
        ...baseData,
        vibration: randomInRange(0.8, 1.2, index * 1.7), // High vibration
        status: 'warning',
        anomalyType
      }
    case 'pressure':
      return {
        ...baseData,
        pressure: randomInRange(95, 105, index * 1.8), // High pressure
        status: 'critical',
        anomalyType
      }
    case 'power':
      return {
        ...baseData,
        powerConsumption: randomInRange(70, 80, index * 1.9), // High power consumption
        status: 'warning',
        anomalyType
      }
    case 'multiple':
      return {
        ...baseData,
        temperature: randomInRange(80, 85, index * 2.0),
        vibration: randomInRange(0.5, 0.7, index * 2.1),
        pressure: randomInRange(90, 95, index * 2.2),
        powerConsumption: randomInRange(60, 65, index * 2.3),
        status: 'critical',
        anomalyType
      }
    default:
      return baseData
  }
}

// Generate the complete dataset
export const sensorData: SensorData[] = Array.from({ length: 400 }, (_, index) => {
  // Generate anomalies at specific intervals
  if (index % 50 === 0 || index % 67 === 0 || index % 89 === 0) {
    return generateAnomaly(index)
  }
  return generateNormalReadings(index)
}) 