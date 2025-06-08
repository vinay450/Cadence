import React from 'react';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Analyzing data...' }: LoadingProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center space-y-8 p-8 max-w-2xl mx-auto">
        {/* Main processing animation */}
        <div className="relative w-32 h-32">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-[spin_2s_linear_infinite_reverse]" />
          
          {/* Inner processing circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-3 w-3 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-12px]" />
            <div className="absolute h-3 w-3 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-12px] rotate-[60deg]" style={{ animationDelay: '0.25s' }} />
            <div className="absolute h-3 w-3 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-12px] rotate-[120deg]" style={{ animationDelay: '0.5s' }} />
            <div className="absolute h-3 w-3 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-12px] rotate-[180deg]" style={{ animationDelay: '0.75s' }} />
            <div className="absolute h-3 w-3 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-12px] rotate-[240deg]" style={{ animationDelay: '1s' }} />
            <div className="absolute h-3 w-3 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-12px] rotate-[300deg]" style={{ animationDelay: '1.25s' }} />
          </div>
          
          {/* Center dot */}
          <div className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Processing status */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {message}
            </span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
          
          {/* Processing steps */}
          <div className="flex flex-col items-center text-base text-muted-foreground space-y-3">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              <span className="animate-pulse">Processing data patterns</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              <span className="animate-pulse delay-500">Generating insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              <span className="animate-pulse delay-1000">Preparing visualization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 