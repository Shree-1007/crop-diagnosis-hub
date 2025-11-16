import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X, Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { DiseaseClassifier } from '@/lib/diseaseClassification';
import ModelLoader from '@/lib/modelLoader';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClearImage: () => void;
  onAnalyze: (image: File, result?: any) => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onClearImage, onAnalyze }: ImageUploadProps) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  
  const handleAnalyzeClick = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      // Use the DiseaseClassifier with our TensorFlow.js model
      const classifier = new DiseaseClassifier();
      console.log('Starting image classification...');
      const result = await classifier.classifyImage(selectedImage);
      console.log('Classification result:', result);
      
      onAnalyze(selectedImage, result);
    } catch (error: any) {
      console.error('Error during image analysis:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      console.error('Error details:', errorMessage);
      toast.error(`Failed to analyze image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize model on component mount
  useEffect(() => {
    const initModel = async () => {
      try {
        await ModelLoader.loadModel();
        setModelReady(true);
      } catch (error) {
        console.error('Failed to load model:', error);
        toast.error('Failed to load plant disease model');
      }
    };
    
    initModel();
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      return;
    }

    onImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      {selectedImage ? (
        <div className="space-y-4">
          <div className="relative agro-card p-4">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={onClearImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected plant"
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {selectedImage.name}
            </p>
          </div>
          
          {/* Process Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleAnalyzeClick}
              variant="default"
              size="lg"
              disabled={isLoading || !modelReady}
              className="hero-gradient text-white px-8 py-6 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t.analysis.analyzing}
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  {t.hero.analyzeButton || 'Process Image'}
                </>
              )}
            </Button>
          </div>
          
          {!modelReady && (
            <p className="text-sm text-muted-foreground text-center">
              Loading model, please wait...
            </p>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragOver
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Plant Image</h3>
              <p className="text-muted-foreground">
                Drag and drop an image or click to browse
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="default"
                className="hero-gradient text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t.hero.uploadButton}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCameraCapture}
              >
                <Camera className="h-4 w-4 mr-2" />
                {t.hero.captureButton}
              </Button>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
    </div>
  );
};