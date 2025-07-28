import { progressConfig } from '../config/progressConfig';

// Custom progress bar implementation (no external dependencies)
class CustomProgressBar {
  private element: HTMLDivElement | null = null;
  private pegElement: HTMLDivElement | null = null;
  private percentageElement: HTMLDivElement | null = null;
  private isActive = false;
  private currentProgress = 0;
  private progressTimeout: NodeJS.Timeout | null = null;
  private incrementInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.createProgressBar();
  }

  private createProgressBar() {
    if (typeof document === 'undefined') return;

    // Create main progress bar container
    this.element = document.createElement('div');
    this.element.id = 'custom-progress-bar';
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: ${progressConfig.height}px;
      background: ${progressConfig.color};
      z-index: ${progressConfig.zIndex};
      transform: translateX(-100%);
      transition: transform ${progressConfig.speed}ms ease;
      box-shadow: 0 0 10px ${progressConfig.color}, 0 0 5px ${progressConfig.color};
    `;

    // Create peg element (YouTube-style glow effect)
    this.pegElement = document.createElement('div');
    this.pegElement.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      height: 100%;
      background: ${progressConfig.color};
      box-shadow: 0 0 10px ${progressConfig.color}, 0 0 5px ${progressConfig.color};
      opacity: 1;
      transform: rotate(3deg) translate(0px, -4px);
    `;

    this.element.appendChild(this.pegElement);
    document.body.appendChild(this.element);
  }

  private createPercentageOverlay() {
    if (!progressConfig.showPercentage || typeof document === 'undefined') return;

    this.percentageElement = document.createElement('div');
    this.percentageElement.id = 'progress-percentage';
    this.percentageElement.style.cssText = `
      position: fixed;
      top: ${progressConfig.height + 5}px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      z-index: ${progressConfig.zIndex + 1};
      pointer-events: none;
      transition: opacity 0.2s ease;
      opacity: 0;
    `;
    document.body.appendChild(this.percentageElement);
  }

  private updatePercentage(percent: number) {
    if (!this.percentageElement || !progressConfig.showPercentage) return;

    this.percentageElement.textContent = `${Math.round(percent)}%`;
    this.percentageElement.style.opacity = percent > 0 ? '1' : '0';
  }

  private removePercentageOverlay() {
    if (this.percentageElement && this.percentageElement.parentNode) {
      this.percentageElement.parentNode.removeChild(this.percentageElement);
      this.percentageElement = null;
    }
  }

  private updateProgress(percent: number) {
    if (!this.element) return;

    this.currentProgress = Math.max(0, Math.min(100, percent));
    const translateX = this.currentProgress - 100;
    this.element.style.transform = `translateX(${translateX}%)`;
    this.updatePercentage(this.currentProgress);
  }

  start(initialProgress: number = progressConfig.minProgress) {
    if (this.isActive) return;

    this.isActive = true;
    this.currentProgress = initialProgress;

    if (this.element) {
      this.element.style.transform = `translateX(${(initialProgress - 100)}%)`;
    }

    this.createPercentageOverlay();
    this.updatePercentage(this.currentProgress);
    this.startIncrementalProgress();
  }

  set(percent: number) {
    if (!this.isActive) return;
    this.updateProgress(percent);
  }

  increment(amount: number = 10) {
    if (!this.isActive) return;
    this.updateProgress(this.currentProgress + amount);
  }

  done() {
    if (!this.isActive) return;

    // Clear any pending timeouts
    if (this.progressTimeout) {
      clearTimeout(this.progressTimeout);
      this.progressTimeout = null;
    }

    if (this.incrementInterval) {
      clearInterval(this.incrementInterval);
      this.incrementInterval = null;
    }

    // Complete the progress
    this.updateProgress(100);

    // Hide after a short delay
    this.progressTimeout = setTimeout(() => {
      if (this.element) {
        this.element.style.transform = 'translateX(-100%)';
      }
      this.removePercentageOverlay();
      this.isActive = false;
      this.currentProgress = 0;
    }, 200);
  }

  private startIncrementalProgress() {
    let stepIndex = 0;

    this.incrementInterval = setInterval(() => {
      if (stepIndex < progressConfig.incrementSteps.length) {
        const targetProgress = progressConfig.incrementSteps[stepIndex];
        this.set(targetProgress);
        stepIndex++;
      } else {
        // Continue slow increment if not completed
        this.increment(1);
      }
    }, 500);
  }

  destroy() {
    this.done();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.removePercentageOverlay();
  }
}

// Create global instance
const progressBar = new CustomProgressBar();

// Export functions that match nprogress API
export const startProgress = (initialProgress: number = progressConfig.minProgress) => {
  progressBar.start(initialProgress);
};

export const incrementProgress = (amount: number = 10) => {
  progressBar.increment(amount);
};

export const setProgress = (percent: number) => {
  progressBar.set(percent);
};

export const stopProgress = () => {
  progressBar.done();
};

export const getProgressState = () => ({
  isActive: progressBar['isActive'],
  currentProgress: progressBar['currentProgress'],
  isPercentageVisible: progressConfig.showPercentage,
});

export const configureProgress = (config: Partial<typeof progressConfig>) => {
  Object.assign(progressConfig, config);
  
  // Recreate progress bar if color or height changed
  if (typeof document !== 'undefined') {
    progressBar.destroy();
    // The progress bar will be recreated on next start
  }
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    progressBar.destroy();
  });
} 