import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DiseaseClassifier, ClassificationResult } from '@/lib/diseaseClassification';
import { getOpenRouterCompletion } from "@/lib/ai-assistant";
import { Leaf, Brain, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";
import heroImage from '@/assets/agro-hero.jpg';

const Index = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ClassificationResult | null>(null);
  const [classifier] = useState(new DiseaseClassifier());
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

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

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    
    // Add an empty assistant message that will be updated with streaming content
    const assistantMessageIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    
    // Use the streaming API
    await getOpenRouterCompletion(
      userMessage,
      (chunk) => {
        // Update the assistant message with each new chunk
        setMessages(currentMessages => {
          const updatedMessages = [...currentMessages];
          if (updatedMessages[assistantMessageIndex]) {
            updatedMessages[assistantMessageIndex] = {
              role: "assistant",
              content: (updatedMessages[assistantMessageIndex].content || "") + chunk
            };
          }
          return updatedMessages;
        });
      }
    );
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

      {/* AI Assistant Toggle Button */}
      <Button
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        className="fixed bottom-4 right-4 z-50"
      >
        {isAssistantOpen ? "Close Assistant" : "Open Assistant"}
      </Button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 w-full max-w-md h-2/3 bg-white border-t border-gray-200 shadow-lg rounded-t-lg flex flex-col z-50"
          >
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold">AI Assistant</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAssistantOpen(false)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the AI assistant..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="ml-2">
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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