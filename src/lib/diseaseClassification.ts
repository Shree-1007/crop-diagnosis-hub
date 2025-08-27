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

// Mock CNN model for disease classification
export class DiseaseClassifier {
  private diseases: Disease[] = [
    {
      id: 'tomato_blight',
      name: 'Tomato Blight',
      confidence: 0.92,
      description: 'A fungal disease affecting tomato plants, causing brown spots and leaf yellowing.',
      symptoms: ['Brown spots on leaves', 'Yellowing of foliage', 'Fruit rot'],
      fertilizers: ['copper_fungicide', 'organic_compost'],
      treatmentSteps: [
        'Remove affected leaves immediately',
        'Apply copper fungicide spray',
        'Improve air circulation',
        'Reduce watering frequency'
      ]
    },
    {
      id: 'wheat_rust',
      name: 'Wheat Rust',
      confidence: 0.88,
      description: 'A fungal disease that creates orange-red pustules on wheat leaves.',
      symptoms: ['Orange-red pustules', 'Leaf discoloration', 'Reduced grain quality'],
      fertilizers: ['potassium_fertilizer', 'nitrogen_supplement'],
      treatmentSteps: [
        'Apply systemic fungicide',
        'Increase potassium levels',
        'Monitor weather conditions',
        'Use resistant varieties'
      ]
    },
    {
      id: 'corn_smut',
      name: 'Corn Smut',
      confidence: 0.85,
      description: 'A fungal disease causing large galls on corn plants.',
      symptoms: ['Large white galls', 'Distorted plant growth', 'Reduced yield'],
      fertilizers: ['phosphorus_boost', 'organic_compost'],
      treatmentSteps: [
        'Remove infected plants',
        'Apply phosphorus fertilizer',
        'Practice crop rotation',
        'Control insect vectors'
      ]
    },
    {
      id: 'potato_scab',
      name: 'Potato Scab',
      confidence: 0.79,
      description: 'A bacterial disease causing scab-like lesions on potato tubers.',
      symptoms: ['Scab-like lesions', 'Rough skin texture', 'Reduced marketability'],
      fertilizers: ['organic_compost', 'nitrogen_supplement'],
      treatmentSteps: [
        'Maintain soil pH below 5.2',
        'Use certified seed potatoes',
        'Apply organic matter',
        'Ensure proper drainage'
      ]
    },
    {
      id: 'rice_blast',
      name: 'Rice Blast',
      confidence: 0.94,
      description: 'A serious fungal disease affecting rice plants worldwide.',
      symptoms: ['Diamond-shaped spots', 'Leaf burn', 'Panicle infection'],
      fertilizers: ['potassium_fertilizer', 'copper_fungicide'],
      treatmentSteps: [
        'Apply preventive fungicide',
        'Balance nitrogen fertilization',
        'Manage water levels',
        'Use resistant varieties'
      ]
    }
  ];

  private fertilizers: Record<string, FertilizerRecommendation> = {
    copper_fungicide: {
      name: 'Copper Fungicide',
      dosage: '2-3 grams per liter',
      application: 'Foliar spray',
      frequency: 'Every 7-10 days',
      benefits: ['Controls fungal diseases', 'Broad spectrum protection', 'Long-lasting effect']
    },
    organic_compost: {
      name: 'Organic Compost',
      dosage: '2-3 kg per plant',
      application: 'Soil application',
      frequency: 'Once per season',
      benefits: ['Improves soil health', 'Enhances nutrient availability', 'Boosts plant immunity']
    },
    potassium_fertilizer: {
      name: 'Potassium Fertilizer',
      dosage: '50-100 grams per plant',
      application: 'Soil application',
      frequency: 'Every 15 days',
      benefits: ['Increases disease resistance', 'Improves fruit quality', 'Enhances water regulation']
    },
    nitrogen_supplement: {
      name: 'Nitrogen Supplement',
      dosage: '20-30 grams per plant',
      application: 'Foliar spray or soil',
      frequency: 'Every 10-14 days',
      benefits: ['Promotes leaf growth', 'Enhances chlorophyll production', 'Improves overall vigor']
    },
    phosphorus_boost: {
      name: 'Phosphorus Boost',
      dosage: '15-25 grams per plant',
      application: 'Soil application',
      frequency: 'Every 20 days',
      benefits: ['Enhances root development', 'Improves flowering', 'Increases fruit set']
    }
  };

  async classifyImage(imageFile: File): Promise<ClassificationResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Mock classification logic
    const isHealthy = Math.random() > 0.7;
    
    if (isHealthy) {
      return {
        disease: {
          id: 'healthy',
          name: 'Healthy Plant',
          confidence: 0.95,
          description: 'Your plant appears to be healthy with no visible signs of disease.',
          symptoms: ['Vibrant green color', 'Strong stem structure', 'No visible lesions'],
          fertilizers: ['organic_compost'],
          treatmentSteps: [
            'Continue regular watering',
            'Maintain proper fertilization',
            'Monitor for early signs',
            'Practice preventive care'
          ]
        },
        isHealthy: true,
        recommendations: [this.fertilizers.organic_compost]
      };
    }

    // Select a random disease for demonstration
    const randomDisease = this.diseases[Math.floor(Math.random() * this.diseases.length)];
    const recommendations = randomDisease.fertilizers.map(id => this.fertilizers[id]);

    return {
      disease: randomDisease,
      isHealthy: false,
      recommendations
    };
  }

  async preprocessImage(imageFile: File): Promise<ImageData> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 224;
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);
        const imageData = ctx.getImageData(0, 0, 224, 224);
        resolve(imageData);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }
}