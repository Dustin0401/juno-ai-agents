import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  width?: string | number;
  height?: string | number;
  interval?: string;
  theme?: 'light' | 'dark';
  style?: '1' | '2' | '3' | '8' | '9';
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(({
  symbol = 'BINANCE:BTCUSDT',
  width = '100%',
  height = 400,
  interval = '1D',
  theme = 'dark',
  style = '1',
  locale = 'en',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  container_id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const containerId = container_id || `tradingview_${Math.random().toString(36).substr(2, 9)}`;
    
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }

    // Remove existing script if it exists
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: false,
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
      symbol,
      interval,
      timezone: 'Etc/UTC',
      theme: theme === 'dark' ? 'dark' : 'light',
      style,
      locale,
      toolbar_bg,
      enable_publishing,
      allow_symbol_change,
      container_id: containerId,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com'
    });

    scriptRef.current = script;
    
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [symbol, width, height, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, container_id]);

  return (
    <div className="tradingview-widget-container">
      <div 
        ref={containerRef}
        style={{ 
          width: typeof width === 'string' ? width : `${width}px`,
          height: typeof height === 'string' ? height : `${height}px`
        }}
      />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
});