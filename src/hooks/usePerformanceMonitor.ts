import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  errorCount: number;
  lastUpdate: Date;
}

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errorCount: 0,
    lastUpdate: new Date()
  });

  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Performance observer for measuring render times
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev,
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            lastUpdate: new Date()
          }));
        }

        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration,
            lastUpdate: new Date()
          }));
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'measure'] });
      setIsMonitoring(true);
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  // Memory usage monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
          lastUpdate: new Date()
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Error monitoring
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorLog: ErrorLog = {
        id: Date.now().toString(),
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        url: event.filename || window.location.href,
        userAgent: navigator.userAgent
      };

      setErrors(prev => [errorLog, ...prev.slice(0, 49)]); // Keep last 50 errors
      setMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        lastUpdate: new Date()
      }));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorLog: ErrorLog = {
        id: Date.now().toString(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      setErrors(prev => [errorLog, ...prev.slice(0, 49)]);
      setMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        lastUpdate: new Date()
      }));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Network request monitoring
  useEffect(() => {
    let requestCount = 0;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      requestCount++;
      setMetrics(prev => ({
        ...prev,
        networkRequests: requestCount,
        lastUpdate: new Date()
      }));
      return originalFetch(...args);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      requestCount++;
      setMetrics(prev => ({
        ...prev,
        networkRequests: requestCount,
        lastUpdate: new Date()
      }));
      return originalXHROpen.apply(this, args);
    };

    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setMetrics(prev => ({
      ...prev,
      errorCount: 0,
      lastUpdate: new Date()
    }));
  }, []);

  const getHealthScore = useCallback(() => {
    let score = 100;
    
    // Deduct points for high load time
    if (metrics.loadTime > 3000) score -= 20;
    else if (metrics.loadTime > 1000) score -= 10;
    
    // Deduct points for high memory usage
    if (metrics.memoryUsage > 100) score -= 15;
    else if (metrics.memoryUsage > 50) score -= 8;
    
    // Deduct points for errors
    if (metrics.errorCount > 10) score -= 25;
    else if (metrics.errorCount > 5) score -= 15;
    else if (metrics.errorCount > 0) score -= 5;
    
    return Math.max(0, score);
  }, [metrics]);

  const exportReport = useCallback(() => {
    const report = {
      metrics,
      errors: errors.slice(0, 20), // Include only recent errors
      healthScore: getHealthScore(),
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `juno-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [metrics, errors, getHealthScore]);

  return {
    metrics,
    errors,
    isMonitoring,
    healthScore: getHealthScore(),
    clearErrors,
    exportReport
  };
};