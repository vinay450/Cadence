import React from 'react';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Analyzing data...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Main processing animation */}
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-[spin_2s_linear_infinite_reverse]" />
        
        {/* Inner processing circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-2 w-2 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-8px]" />
          <div className="absolute h-2 w-2 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-8px] rotate-[60deg]" style={{ animationDelay: '0.25s' }} />
          <div className="absolute h-2 w-2 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-8px] rotate-[120deg]" style={{ animationDelay: '0.5s' }} />
          <div className="absolute h-2 w-2 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-8px] rotate-[180deg]" style={{ animationDelay: '0.75s' }} />
          <div className="absolute h-2 w-2 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-8px] rotate-[240deg]" style={{ animationDelay: '1s' }} />
          <div className="absolute h-2 w-2 rounded-full bg-primary animate-[pulse_1.5s_infinite] translate-y-[-8px] rotate-[300deg]" style={{ animationDelay: '1.25s' }} />
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-primary animate-pulse" />
      </div>

      {/* Processing status */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {message}
          </span>
          <div className="flex space-x-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
        
        {/* Processing steps */}
        <div className="flex flex-col items-center text-sm text-muted-foreground space-y-1">
          <span className="animate-pulse">Processing data patterns</span>
          <span className="animate-pulse delay-500">Generating insights</span>
          <span className="animate-pulse delay-1000">Preparing visualization</span>
        </div>
      </div>
    </div>
  );
} 