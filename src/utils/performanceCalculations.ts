import { Project, Milestone, PerformanceRating, PerformanceMetrics } from '@/types/project';
import { differenceInMonths } from 'date-fns';

export const PERFORMANCE_CRITERIA_DATA = [
  {
    driver: 'Project Delay',
    criteria: '% of digital initiatives delayed',
    critical: '>20% delayed',
    high: '10-20% delayed',
    medium: '5-10% delayed',
    low: '<5% delayed',
  },
  {
    driver: 'User Adoption Rate',
    criteria: 'Weighted average of active user adoption rate (measured 6 months post go-live)',
    critical: '<70% user adoption',
    high: '70-80% user adoption',
    medium: '80-90% user adoption',
    low: '>90% user adoption',
  },
];

/**
 * Calculate project delay percentage based on milestones
 */
export const calculateProjectDelayPercentage = (
  project: Project,
  milestones: Milestone[]
): number => {
  if (milestones.length === 0) return 0;

  const delayedMilestones = milestones.filter(milestone => {
    // A milestone is delayed if:
    // 1. Status is 'delayed', OR
    // 2. It's completed but completed after target date, OR
    // 3. It's not completed and target date has passed
    if (milestone.status === 'delayed') return true;
    
    if (milestone.completedDate && milestone.targetDate) {
      return new Date(milestone.completedDate) > new Date(milestone.targetDate);
    }
    
    if (milestone.status !== 'completed' && new Date(milestone.targetDate) < new Date()) {
      return true;
    }
    
    return false;
  });

  return Math.round((delayedMilestones.length / milestones.length) * 100);
};

/**
 * Determine performance rating based on delay percentage and adoption rate
 */
export const determinePerformanceRating = (
  delayPercentage: number,
  adoptionRate: number | null
): PerformanceRating => {
  // Delay-based rating
  let delayRating: PerformanceRating;
  if (delayPercentage > 20) delayRating = 'critical';
  else if (delayPercentage >= 10) delayRating = 'high';
  else if (delayPercentage >= 5) delayRating = 'medium';
  else delayRating = 'low';

  // If adoption rate is not available, base rating on delay only
  if (adoptionRate === null) {
    return delayRating;
  }

  // Adoption-based rating
  let adoptionRating: PerformanceRating;
  if (adoptionRate < 70) adoptionRating = 'critical';
  else if (adoptionRate < 80) adoptionRating = 'high';
  else if (adoptionRate < 90) adoptionRating = 'medium';
  else adoptionRating = 'low';

  // Return most conservative (worst) rating
  const ratings: PerformanceRating[] = ['low', 'medium', 'high', 'critical'];
  const delayIndex = ratings.indexOf(delayRating);
  const adoptionIndex = ratings.indexOf(adoptionRating);
  
  return ratings[Math.max(delayIndex, adoptionIndex)];
};

/**
 * Check if adoption can be measured (6 months post go-live)
 */
export const canMeasureAdoption = (goLiveDate: string): boolean => {
  const monthsSinceGoLive = differenceInMonths(new Date(), new Date(goLiveDate));
  return monthsSinceGoLive >= 6;
};

/**
 * Get the date when adoption measurement becomes available
 */
export const getAdoptionMeasurementDate = (goLiveDate: string): Date => {
  const goLive = new Date(goLiveDate);
  goLive.setMonth(goLive.getMonth() + 6);
  return goLive;
};

/**
 * Generate actionable insights based on performance metrics
 */
export const getPerformanceInsights = (
  metrics: PerformanceMetrics,
  project: Project,
  totalMilestones: number
): string[] => {
  const insights: string[] = [];

  // Delay insights
  if (metrics.projectDelayPercentage > 20) {
    insights.push('🚨 Critical: Project significantly behind schedule. Immediate intervention required.');
  } else if (metrics.projectDelayPercentage >= 10) {
    insights.push('⚠️ Warning: Project experiencing delays. Review milestone timeline and resource allocation.');
  } else if (metrics.projectDelayPercentage >= 5) {
    const delayedCount = Math.ceil((metrics.projectDelayPercentage / 100) * totalMilestones);
    const needToComplete = Math.ceil(totalMilestones * 0.05) - delayedCount;
    insights.push(`⚡ Action: Complete ${needToComplete} more milestone(s) on time to reach Low rating.`);
  } else {
    insights.push('✅ Excellent: Project on track with minimal delays.');
  }

  // Adoption insights
  if (metrics.userAdoptionRate === null) {
    if (canMeasureAdoption(project.goLiveDate)) {
      const measurementDate = getAdoptionMeasurementDate(project.goLiveDate);
      insights.push(`📊 Action Required: User adoption measurement window is now open. Schedule adoption survey immediately.`);
    } else {
      const measurementDate = getAdoptionMeasurementDate(project.goLiveDate);
      insights.push(`📅 Upcoming: User adoption can be measured after ${measurementDate.toLocaleDateString()}.`);
    }
  } else {
    if (metrics.userAdoptionRate < 70) {
      insights.push('🚨 Critical: User adoption below target. Implement user training and support programs.');
    } else if (metrics.userAdoptionRate < 80) {
      insights.push('⚠️ Warning: User adoption needs improvement. Consider additional change management activities.');
    } else if (metrics.userAdoptionRate < 90) {
      insights.push('⚡ Good: User adoption is acceptable. Continue monitoring and support.');
    } else {
      insights.push('✅ Excellent: Outstanding user adoption rate.');
    }
  }

  // Year-end readiness
  const monthsToYearEnd = 12 - new Date().getMonth();
  if (monthsToYearEnd <= 3) {
    insights.push(`📋 Year-End: ${monthsToYearEnd} month(s) until evaluation. Current rating: ${metrics.performanceRating.toUpperCase()}.`);
  }

  return insights;
};

/**
 * Update project performance metrics
 */
export const updateProjectPerformance = (
  project: Project,
  milestones: Milestone[]
): PerformanceMetrics => {
  const delayPercentage = calculateProjectDelayPercentage(project, milestones);
  const adoptionRate = project.performanceMetrics?.userAdoptionRate ?? null;
  const rating = determinePerformanceRating(delayPercentage, adoptionRate);

  return {
    projectDelayPercentage: delayPercentage,
    userAdoptionRate: adoptionRate,
    performanceRating: rating,
    adoptionMeasurementDate: project.performanceMetrics?.adoptionMeasurementDate,
    lastCalculated: new Date().toISOString(),
  };
};

/**
 * Get performance rating color
 */
export const getPerformanceColor = (rating: PerformanceRating): string => {
  const colors = {
    critical: 'hsl(var(--destructive))',
    high: 'hsl(var(--warning))',
    medium: 'hsl(var(--rating-medium))',
    low: 'hsl(var(--success))',
  };
  return colors[rating];
};

/**
 * Get performance rating background class
 */
export const getPerformanceBgClass = (rating: PerformanceRating): string => {
  const classes = {
    critical: 'bg-destructive text-destructive-foreground',
    high: 'bg-warning text-warning-foreground',
    medium: 'bg-ratingMedium text-ratingMedium-foreground',
    low: 'bg-success text-success-foreground',
  };
  return classes[rating];
};
