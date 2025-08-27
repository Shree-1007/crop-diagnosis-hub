import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { DiseaseClassifier, ClassificationResult } from '@/lib/diseaseClassification';
import { Leaf, Brain, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/agro-hero.jpg';

const Index = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ClassificationResult | null>(null);
  const [classifier] = useState(new DiseaseClassifier());

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    toast.success('Image uploaded successfully!');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await classifier.classifyImage(selectedImage);
      setAnalysisResult(result);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Failed to analyze image. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary text-white">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{t.appName}</h1>
              <p className="text-sm text-muted-foreground">{t.tagline}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!analysisResult ? (
          <>
            {/* Hero Section */}
            <section className="text-center py-12 space-y-8">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={heroImage}
                  alt="Agricultural technology"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 hero-gradient opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white space-y-4 max-w-2xl px-4">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                      {t.hero.title}
                    </h2>
                    <p className="text-lg md:text-xl opacity-90">
                      {t.hero.subtitle}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        <span>AI-Powered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Real-time Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upload Section */}
            <section className="max-w-2xl mx-auto space-y-6">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClearImage={handleClearImage}
              />

              {selectedImage && (
                <div className="text-center">
                  <Button
                    size="lg"
                    className="hero-gradient text-white px-8 py-3 text-lg font-semibold"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t.analysis.analyzing}
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        {t.hero.analyzeButton}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </section>

            {/* Loading State */}
            {isAnalyzing && (
              <section className="max-w-2xl mx-auto">
                <LoadingSpinner />
              </section>
            )}
          </>
        ) : (
          <>
            {/* Results Section */}
            <section className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <Button
                  variant="outline"
                  onClick={handleNewAnalysis}
                >
                  {t.common.newAnalysis}
                </Button>
              </div>
              
              <AnalysisResults 
                result={analysisResult} 
                imageFile={selectedImage!}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary leaf-float" />
            <span className="font-semibold gradient-text">{t.appName}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering farmers with AI-driven crop health insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;