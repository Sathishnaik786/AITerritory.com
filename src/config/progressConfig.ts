export const progressConfig = {
  // YouTube-style red color
  color: '#ff0000',
  
  // Bar height in pixels
  height: 3,
  
  // Show percentage text overlay
  showPercentage: false,
  
  // Animation speed in milliseconds
  speed: 300,
  
  // Progress bar z-index (should be above backdrop loader)
  zIndex: 10000,
  
  // Increment steps for smooth animation
  incrementSteps: [10, 20, 40, 60, 80, 90, 95, 98, 100],
  
  // Debounce delay for stopping progress
  debounceDelay: 200,
  
  // Minimum progress before showing bar
  minProgress: 5,
  
  // Maximum progress before completion
  maxProgress: 95,
}; 