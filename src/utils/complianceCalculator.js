/**
 * Evaluates sensor readings against configured reference thresholds
 * and computes overall and category-specific compliance percentages.
 */

export function evaluateParameterStatus(paramId, value, threshold) {
  if (value === null || value === undefined || isNaN(value) || !threshold) {
    return { status: 'NORMAL', severity: 'INFO', label: 'NORMAL' };
  }

  const num = Number(value);

  // Range-based parameters (e.g. pH)
  if (threshold.isRange) {
    const { violationLow, warningLow, warningHigh, violationHigh } = threshold;
    if (num < violationLow || num > violationHigh) {
      return { status: 'VIOLATION', severity: 'CRITICAL', label: 'VIOLATION' };
    }
    if (num < warningLow || num > warningHigh) {
      return { status: 'WARNING', severity: 'WARNING', label: 'WARNING' };
    }
    return { status: 'NORMAL', severity: 'INFO', label: 'NORMAL' };
  }

  // Upper-limit parameters (airQuality, turbidity, temperature, humidity)
  const { warning, violation } = threshold;
  if (num >= violation) {
    return { status: 'VIOLATION', severity: 'CRITICAL', label: 'VIOLATION' };
  }
  if (num >= warning) {
    return { status: 'WARNING', severity: 'WARNING', label: 'WARNING' };
  }
  return { status: 'NORMAL', severity: 'INFO', label: 'NORMAL' };
}

/**
 * Calculates overall, air, and water compliance scores given current readings and thresholds
 */
export function calculateCompliance(readings, thresholds) {
  if (!readings || !thresholds) {
    return {
      overallPercentage: 100,
      airPercentage: 100,
      waterPercentage: 100,
      overallStatus: 'COMPLIANT',
      normalCount: 5,
      warningCount: 0,
      violationCount: 0,
      totalParameters: 5,
      details: {}
    };
  }

  const paramKeys = ['airQuality', 'temperature', 'humidity', 'ph', 'turbidity'];
  const airKeys = ['airQuality', 'temperature', 'humidity'];
  const waterKeys = ['ph', 'turbidity'];

  let normalCount = 0;
  let warningCount = 0;
  let violationCount = 0;

  const details = {};

  paramKeys.forEach((key) => {
    const val = readings[key];
    const thresh = thresholds[key];
    const evaluation = evaluateParameterStatus(key, val, thresh);
    details[key] = {
      value: val,
      threshold: thresh,
      ...evaluation
    };

    if (evaluation.status === 'VIOLATION') {
      violationCount++;
    } else if (evaluation.status === 'WARNING') {
      warningCount++;
    } else {
      normalCount++;
    }
  });

  // Calculate score weights:
  // NORMAL = 100%, WARNING = 60%, VIOLATION = 0%
  const getScore = (keys) => {
    if (keys.length === 0) return 100;
    const totalPoints = keys.reduce((acc, k) => {
      const st = details[k]?.status;
      if (st === 'NORMAL') return acc + 100;
      if (st === 'WARNING') return acc + 60;
      return acc + 0; // VIOLATION
    }, 0);
    return Math.round(totalPoints / keys.length);
  };

  const overallPercentage = getScore(paramKeys);
  const airPercentage = getScore(airKeys);
  const waterPercentage = getScore(waterKeys);

  let overallStatus = 'COMPLIANT';
  if (violationCount > 0 || overallPercentage < 70) {
    overallStatus = 'NON-COMPLIANT';
  } else if (warningCount > 0 || overallPercentage < 90) {
    overallStatus = 'PARTIALLY COMPLIANT';
  }

  return {
    overallPercentage,
    airPercentage,
    waterPercentage,
    overallStatus,
    normalCount,
    warningCount,
    violationCount,
    totalParameters: paramKeys.length,
    details
  };
}

