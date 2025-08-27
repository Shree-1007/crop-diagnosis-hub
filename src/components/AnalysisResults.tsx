import { ClassificationResult } from '@/lib/diseaseClassification';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Droplets, Calendar, Target } from 'lucide-react';

interface AnalysisResultsProps {
  result: ClassificationResult;
  imageFile: File;
}

export const AnalysisResults = ({ result, imageFile }: AnalysisResultsProps) => {
  const { t } = useLanguage();
  const { disease, isHealthy, recommendations } = result;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Image and Disease Detection */}
      <Card className="agro-card overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Analyzed plant"
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 animate-pulse" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-yellow-500 animate-pulse" />
                )}
                <h2 className="text-xl font-bold">
                  {isHealthy ? t.analysis.healthyPlant : t.analysis.diseaseDetected}
                </h2>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold gradient-text">
                  {t.diseases[disease.id as keyof typeof t.diseases] || disease.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {disease.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t.analysis.confidence}</span>
                  <span className="font-medium">{Math.round(disease.confidence * 100)}%</span>
                </div>
                <Progress 
                  value={disease.confidence * 100} 
                  className="h-2"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {disease.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Recommendations */}
      <Card className="agro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            {t.analysis.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((fertilizer, index) => (
            <div 
              key={index} 
              className="p-4 border border-border/50 rounded-lg hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary">
                    {t.fertilizers[fertilizer.name.toLowerCase().replace(' ', '_') as keyof typeof t.fertilizers] || fertilizer.name}
                  </h4>
                  <Badge variant="secondary">{fertilizer.application}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dosage:</span>
                    <span className="font-medium">{fertilizer.dosage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-medium">{fertilizer.frequency}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Benefits:</p>
                  <div className="flex flex-wrap gap-1">
                    {fertilizer.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Treatment Plan */}
      <Card className="agro-card">
        <CardHeader>
          <CardTitle>{t.analysis.treatmentPlan}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {disease.treatmentSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};