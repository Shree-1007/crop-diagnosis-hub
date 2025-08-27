import { useLanguage } from '@/hooks/useLanguage';
import { Loader2, Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <Leaf className="h-6 w-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">
          {message || t.analysis.analyzing}
        </p>
        <p className="text-sm text-muted-foreground">
          Using advanced AI to analyze your plant...
        </p>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};