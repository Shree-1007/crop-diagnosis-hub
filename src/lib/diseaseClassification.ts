// src/lib/diseaseClassification.ts
import * as tf from '@tensorflow/tfjs';

export interface Disease {
  id: string;
  name: string;
  confidence: number;
  description: string;
  symptoms: string[];
  fertilizers: string[];
  treatmentSteps: string[];
}

export interface ClassificationResult {
  disease: Disease;
  isHealthy: boolean;
  recommendations: FertilizerRecommendation[];
}

export interface FertilizerRecommendation {
  name: string;
  dosage: string;
  application: string;
  frequency: string;
  benefits: string[];
}

export class DiseaseClassifier {
  private model: tf.LayersModel | tf.GraphModel | null = null;
  private isGraphModel: boolean = false;
  private modelPath = '/model/model.json'; // Ensure file is at public/model/model.json

  // ⚠️ CRITICAL: This order MUST match your training class_indices EXACTLY.
  // Keras usually sorts folders alphabetically by default.
  private classLabels = [
    'Banded Chlorosis',
    'Brown Rust',
    'Brown Spot',
    'Dried Leaves',     // Note: Alphabetical placement
    'Grassy Shoot',
    'Healthy Leaves',   // Note: Alphabetical placement
    'Pokkah Boeng',
    'Sett Rot',
    'Smut',
    'Viral Disease',
    'Yellow Leaf'
  ];

  // Database of Sugarcane Diseases
  private diseases: Disease[] = [
    {
      id: 'Banded Chlorosis',
      name: 'Banded Chlorosis',
      confidence: 0,
      description: 'A fungal infection causing chlorotic bands across the leaf blade.',
      symptoms: ['Translucent bands on leaves', 'Leaf distortion', 'Reduced photosynthesis'],
      fertilizers: ['fungicide_spray', 'potassium_boost'],
      treatmentSteps: ['Spray recommended fungicide', 'Improve drainage', 'Avoid water stress']
    },
    {
      id: 'Brown Rust',
      name: 'Brown Rust',
      confidence: 0,
      description: 'Common fungal disease causing elongated brown pustules on leaves.',
      symptoms: ['Reddish-brown pustules', 'Yellow halos around spots', 'Premature leaf drying'],
      fertilizers: ['fungicide_spray', 'nitrogen_control'],
      treatmentSteps: ['Apply foliar fungicide', 'Use resistant varieties', 'Avoid excess nitrogen']
    },
    {
      id: 'Brown Spot',
      name: 'Brown Spot',
      confidence: 0,
      description: 'Fungal disease characterized by reddish-brown spots on the leaf sheath.',
      symptoms: ['Reddish-brown oval spots', 'Spots merging to kill leaf', 'Reduced sugar content'],
      fertilizers: ['fungicide_spray', 'balanced_npk'],
      treatmentSteps: ['Remove infected leaves', 'Apply copper-based fungicide', 'Ensure proper spacing']
    },
    {
      id: 'Grassy Shoot',
      name: 'Grassy Shoot',
      confidence: 0,
      description: 'A phytoplasma disease causing proliferation of grassy, white tillers.',
      symptoms: ['Numerous thin white tillers', 'Stunted growth', 'No cane formation'],
      fertilizers: ['zinc_supplement', 'organic_compost'],
      treatmentSteps: ['Hot water treatment of setts', 'Remove infected clumps', 'Control vector insects']
    },
    {
      id: 'Pokkah Boeng',
      name: 'Pokkah Boeng',
      confidence: 0,
      description: 'Airborne fungal disease causing twisted and deformed plant tops.',
      symptoms: ['Twisted top leaves', 'Reddish patches at leaf base', 'Knife-cut symptoms'],
      fertilizers: ['copper_fungicide', 'growth_booster'],
      treatmentSteps: ['Apply copper oxychloride', 'Remove severely infected plants', 'Monitor during humidity']
    },
    {
      id: 'Sett Rot',
      name: 'Sett Rot',
      confidence: 0,
      description: 'Fungal infection entering through cut ends of sugarcane setts.',
      symptoms: ['Reddish internal tissue', 'Pineapple-like smell', 'Poor germination'],
      fertilizers: ['fungicide_dip', 'soil_treatment'],
      treatmentSteps: ['Dip setts in fungicide before planting', 'Use disease-free seed material', 'Improve soil drainage']
    },
    {
      id: 'Smut',
      name: 'Sugarcane Smut',
      confidence: 0,
      description: 'Serious fungal disease characterized by a whip-like black structure.',
      symptoms: ['Black whip-like structure', 'Stunted growth', 'Thin stalks'],
      fertilizers: ['systemic_fungicide', 'resistant_variety_care'],
      treatmentSteps: ['Remove and burn smut whips', 'Use resistant varieties', 'Avoid ratooning infected fields']
    },
    {
      id: 'Viral Disease',
      name: 'Viral Mosaic/Streak',
      confidence: 0,
      description: 'Viral infection causing mottling or streak patterns on leaves.',
      symptoms: ['Mosaic pattern on leaves', 'Chlorotic streaks', 'Stunted growth'],
      fertilizers: ['immune_booster', 'vector_control'],
      treatmentSteps: ['Control aphid vectors', 'Use virus-free seed cane', 'Remove infected plants (roguing)']
    },
    {
      id: 'Yellow Leaf',
      name: 'Yellow Leaf Disease',
      confidence: 0,
      description: 'Disease causing intense yellowing of the midrib and leaf blade.',
      symptoms: ['Yellowing of midrib', 'Bunching of leaves at top', 'Red discoloration'],
      fertilizers: ['micronutrient_mix', 'virus_management'],
      treatmentSteps: ['Use disease-free tissue culture plants', 'Control aphid vectors', 'Provide adequate irrigation']
    },
    {
      id: 'Dried Leaves',
      name: 'Dried Leaves (Non-Disease)',
      confidence: 0,
      description: 'Natural senescence or drying of leaves due to age or water stress.',
      symptoms: ['Brown, crispy texture', 'No pathogenic spots', 'Occurs on older leaves naturally'],
      fertilizers: ['water_management', 'organic_mulch'],
      treatmentSteps: ['Remove dried leaves (detrashing)', 'Check soil moisture', 'Ensure adequate irrigation']
    },
    {
      id: 'Healthy Leaves',
      name: 'Healthy Sugarcane',
      confidence: 0,
      description: 'Plant appears vigorous with no signs of disease or nutrient deficiency.',
      symptoms: ['Rich green color', 'Upright growth', 'No spots or lesions'],
      fertilizers: ['maintenance_fertilizer'],
      treatmentSteps: ['Continue standard care', 'Monitor regularly', 'Maintain irrigation schedule']
    }
  ];

  private fertilizers: Record<string, FertilizerRecommendation> = {
    fungicide_spray: {
      name: 'Broad Spectrum Fungicide',
      dosage: '2g per liter water',
      application: 'Foliar Spray',
      frequency: 'Every 15 days',
      benefits: ['Controls fungal spread', 'Protects new growth']
    },
    potassium_boost: {
      name: 'Potassium (MOP)',
      dosage: '50kg per acre',
      application: 'Soil Application',
      frequency: 'At earthing up',
      benefits: ['Strengthens stalks', 'Improves disease resistance']
    },
    copper_fungicide: {
      name: 'Copper Oxychloride',
      dosage: '3g per liter',
      application: 'Spray on foliage',
      frequency: 'Once immediately',
      benefits: ['Effective against Pokkah Boeng', 'Bacterial control']
    },
    fungicide_dip: {
      name: 'Carbendazim Dip',
      dosage: '1g per liter',
      application: 'Seed Treatment',
      frequency: 'Before planting',
      benefits: ['Prevents Sett Rot', 'Improves germination']
    },
    maintenance_fertilizer: {
      name: 'Balanced NPK',
      dosage: 'Standard dosage',
      application: 'Soil',
      frequency: 'Regular schedule',
      benefits: ['Maintains health', 'Ensures high yield']
    },
    // Add fallback for others to prevent crashes
    nitrogen_control: { name: 'Nitrogen Management', dosage: 'Reduce Urea', application: 'Soil', frequency: 'As needed', benefits: ['Reduces rust susceptibility'] },
    balanced_npk: { name: 'NPK 19:19:19', dosage: '5g/L', application: 'Spray', frequency: 'Weekly', benefits: ['General health'] },
    zinc_supplement: { name: 'Zinc Sulfate', dosage: '10kg/acre', application: 'Soil', frequency: 'Once', benefits: ['Corrects deficiency'] },
    organic_compost: { name: 'Farm Yard Manure', dosage: '5 ton/acre', application: 'Soil preparation', frequency: 'Seasonally', benefits: ['Soil structure'] },
    growth_booster: { name: 'Plant Growth Regulator', dosage: 'As per label', application: 'Spray', frequency: 'Monthly', benefits: ['Recovers stunted growth'] },
    soil_treatment: { name: 'Trichoderma', dosage: '2kg/acre', application: 'Soil Mix', frequency: 'At planting', benefits: ['Bio-control agent'] },
    systemic_fungicide: { name: 'Propiconazole', dosage: '1ml/L', application: 'Spray', frequency: '15 days', benefits: ['Controls Smut/Rust'] },
    resistant_variety_care: { name: 'Resistant Variety', dosage: 'N/A', application: 'Selection', frequency: 'Planting', benefits: ['Long term prevention'] },
    immune_booster: { name: 'Salicylic Acid', dosage: 'Tablet form', application: 'Root zone', frequency: 'Monthly', benefits: ['Induces systemic resistance'] },
    vector_control: { name: 'Imidacloprid', dosage: '0.5ml/L', application: 'Spray', frequency: 'When insects visible', benefits: ['Controls aphids'] },
    micronutrient_mix: { name: 'Micronutrient Mix', dosage: '5kg/acre', application: 'Soil', frequency: 'Yearly', benefits: ['Prevents yellowing'] },
    virus_management: { name: 'Vector Control', dosage: 'As needed', application: 'Spray', frequency: 'Weekly', benefits: ['Stops spread'] },
    water_management: { name: 'Irrigation', dosage: 'Adequate', application: 'Field', frequency: 'Weekly', benefits: ['Prevents drying'] },
    organic_mulch: { name: 'Trash Mulching', dosage: 'Field residue', application: 'Surface', frequency: 'After harvest', benefits: ['Retains moisture'] }
  };

  private async loadModel() {
    if (!this.model) {
      try {
        console.log('Loading model from:', this.modelPath);
        // Try loading as GraphModel first (for SavedModel/TF.js format)
        try {
          this.model = await tf.loadGraphModel(this.modelPath);
          this.isGraphModel = true;
          console.log('Model loaded successfully as GraphModel');
        } catch (graphError) {
          // If GraphModel fails, try LayersModel
          console.log('GraphModel failed, trying LayersModel...');
          this.model = await tf.loadLayersModel(this.modelPath);
          this.isGraphModel = false;
          console.log('Model loaded successfully as LayersModel');
        }
      } catch (error: any) {
        console.error('Failed to load model:', error);
        console.error('Error details:', error?.message || error);
        throw new Error(`Model loading failed: ${error?.message || 'Unknown error'}. Ensure public/model/model.json exists and is accessible.`);
      }
    }
  }

  async classifyImage(imageFile: File): Promise<ClassificationResult> {
    try {
      await this.loadModel();
      if (!this.model) throw new Error('Model not loaded');

      console.log('Creating image element from file:', imageFile.name);
      const imageElement = await this.createImageElement(imageFile);
      console.log('Image element created, dimensions:', imageElement.width, 'x', imageElement.height);

      const predictions = tf.tidy(() => {
        let tensor = tf.browser.fromPixels(imageElement)
          .resizeBilinear([128, 128]) // Changed to 128x128 based on model input size (mobilenetv2_1.00_128)
          .expandDims(0)
          .toFloat()
          .div(255.0); // Normalization (0-1). Check if your model needs -1 to 1.

        console.log('Running model prediction...');
        let predictionTensor: tf.Tensor;
        
        if (this.isGraphModel) {
          // For GraphModel, use execute with input name
          const graphModel = this.model as tf.GraphModel;
          const inputName = graphModel.inputs[0].name;
          const outputName = graphModel.outputs[0].name;
          console.log(`GraphModel - Input: ${inputName}, Output: ${outputName}`);
          const result = graphModel.execute({ [inputName]: tensor });
          predictionTensor = Array.isArray(result) ? result[0] : result;
        } else {
          // For LayersModel, use predict
          const layersModel = this.model as tf.LayersModel;
          predictionTensor = layersModel.predict(tensor) as tf.Tensor;
        }
        
        // dataSync() copies the data, so we can safely return it
        // tf.tidy() will automatically dispose of tensors when this function completes
        return predictionTensor.dataSync();
      });

      const topClassIndex = this.getIndexOfMax(predictions);
      const labelId = this.classLabels[topClassIndex];
      const confidence = predictions[topClassIndex];

      // Debugging: Log what the model sees
      console.log(`Detected: ${labelId} with ${confidence} confidence`);

      // Find the detailed info for the detected class
      const matchedDisease = this.diseases.find(d => d.id === labelId);

      if (matchedDisease) {
        const isHealthy = labelId === 'Healthy Leaves';
        
        // Map string IDs to actual fertilizer objects
        const recommendations = matchedDisease.fertilizers
          .map(id => this.fertilizers[id])
          .filter(item => item !== undefined);

        return {
          disease: { ...matchedDisease, confidence },
          isHealthy,
          recommendations
        };
      } else {
        return {
          disease: {
            id: 'unknown',
            name: `Unknown (${labelId})`,
            confidence,
            description: 'Result received but no details found in database.',
            symptoms: [],
            fertilizers: [],
            treatmentSteps: []
          },
          isHealthy: false,
          recommendations: []
        };
      }
    } catch (error: any) {
      console.error('Error in classifyImage:', error);
      console.error('Error stack:', error?.stack);
      throw new Error(`Classification failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private getIndexOfMax(arr: Float32Array | Int32Array | Uint8Array): number {
    let maxIndex = 0;
    let maxVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  private createImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }
}