import { useLanguage } from '@/hooks/useLanguage';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative w-32 h-48">
        {/* Animated Sugarcane SVG */}
        <svg
          viewBox="0 0 100 160"
          className="w-full h-full drop-shadow-xl animate-sway"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stalk Segment 1 (Bottom) */}
          <rect
            x="42" y="110" width="16" height="40"
            rx="2"
            className="fill-yellow-200 stroke-green-700 stroke-2 animate-stalk-grow"
          />
          {/* Node Line */}
          <line x1="40" y1="110" x2="60" y2="110" className="stroke-green-800 stroke-2 opacity-50" />

          {/* Stalk Segment 2 (Middle) */}
          <rect
            x="42" y="70" width="16" height="40"
            rx="2"
            className="fill-yellow-100 stroke-green-700 stroke-2 animate-stalk-grow delay-100"
          />
          {/* Node Line */}
          <line x1="40" y1="70" x2="60" y2="70" className="stroke-green-800 stroke-2 opacity-50" />

          {/* Stalk Segment 3 (Top) */}
          <rect
            x="42" y="30" width="16" height="40"
            rx="2"
            className="fill-yellow-200 stroke-green-700 stroke-2 animate-stalk-grow delay-200"
          />

          {/* Right Leaf */}
          <path
            d="M58 40 C 80 20, 90 60, 95 80"
            className="stroke-green-600 stroke-[4] animate-leaf-grow delay-300"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Left Leaf */}
          <path
            d="M42 50 C 20 30, 10 70, 5 90"
            className="stroke-green-600 stroke-[4] animate-leaf-grow delay-500"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Top Sprout */}
          <path
            d="M50 30 L 50 10"
            className="stroke-green-400 stroke-[3] animate-leaf-grow delay-500"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-green-500/20 blur-xl rounded-full animate-pulse" />
      </div>

      <div className="text-center space-y-3 z-10">
        <h3 className="text-xl font-semibold gradient-text animate-pulse">
          {message || t.analysis.analyzing}
        </h3>
        <p className="text-sm text-muted-foreground">
          Simulating crop growth analysis...
        </p>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};