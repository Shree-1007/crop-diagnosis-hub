import * as tf from '@tensorflow/tfjs';
import { toast } from 'sonner';

// Class labels for plant disease classification
const CLASS_NAMES = [
  'Healthy',
  'Tomato_Early_blight',
  'Tomato_Late_blight',
  'Tomato_Leaf_Mold',
  'Tomato_Septoria_leaf_spot',
  'Tomato_Spider_mites',
  'Tomato_Target_Spot',
  'Tomato_Mosaic_virus',
  'Tomato_Yellow_Leaf_Curl_Virus',
  'Corn_Common_rust',
  'Corn_Northern_Leaf_Blight',
  'Corn_Cercospora_leaf_spot',
  'Potato_Early_blight',
  'Potato_Late_blight',
  'Potato_healthy'
];

// Singleton model loader to avoid loading the model multiple times
class ModelLoader {
  private static instance: ModelLoader;
  private model: tf.LayersModel | null = null;
  private isLoading: boolean = false;

  private constructor() {}

  public static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  public async loadModel(): Promise<tf.LayersModel> {
    if (this.model) {
      return this.model;
    }

    if (this.isLoading) {
      // Wait for the model to load if it's already loading
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.model) {
            clearInterval(checkInterval);
            resolve(this.model);
          }
        }, 100);
      });
    }

    this.isLoading = true;
    try {
      // Load a pre-trained model from local public directory
      // We're using a local model file for demonstration
      const modelUrl = '/models/model.json';
      
      toast.info('Loading plant disease classification model...');
      try {
        this.model = await tf.loadLayersModel(modelUrl);
      } catch (error) {
        console.error('Error loading model from URL, using mobilenet instead:', error);
        // Fallback to a pre-trained MobileNet model if our model fails to load
        this.model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
      }
      toast.success('Model loaded successfully!');
      
      return this.model;
    } catch (error) {
      toast.error('Failed to load model. Using fallback classification.');
      console.error('Error loading model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Preprocess the image to match the model's expected input
  public async preprocessImage(imageFile: File): Promise<tf.Tensor> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a tensor from the image
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224]) // Resize to model input size
          .toFloat()
          .div(tf.scalar(255.0))  // Normalize to [0,1]
          .expandDims(0);         // Add batch dimension
        
        resolve(tensor);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Classify the image and return the predicted class
  public async classifyImage(imageFile: File): Promise<{className: string, confidence: number}> {
    try {
      const model = await this.loadModel();
      const tensor = await this.preprocessImage(imageFile);
      
      // Run inference
      const predictions = await model.predict(tensor) as tf.Tensor;
      
      // Get the index with the highest probability
      const predictionData = await predictions.data();
      const maxProbIndex = predictionData.indexOf(Math.max(...Array.from(predictionData)));
      const confidence = predictionData[maxProbIndex];
      
      // Clean up tensors
      tensor.dispose();
      predictions.dispose();
      
      return {
        className: CLASS_NAMES[maxProbIndex],
        confidence: confidence
      };
    } catch (error) {
      console.error('Error during classification:', error);
      // Return a fallback result if classification fails
      return {
        className: 'Unknown',
        confidence: 0
      };
    }
  }
}

export default ModelLoader.getInstance();