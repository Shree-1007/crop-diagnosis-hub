export const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  hi: {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳'
  },
  mr: {
    code: 'mr',
    name: 'मराठी',
    flag: '🇮🇳'
  },
  gu: {
    code: 'gu',
    name: 'ગુજરાતી',
    flag: '🇮🇳'
  },
  ta: {
    code: 'ta',
    name: 'தமிழ்',
    flag: '🇮🇳'
  }
} as const;

export type LanguageCode = keyof typeof languages;

export const translations = {
  en: {
    appName: 'AgroSense',
    tagline: 'AI-Powered Plant Disease Detection',
    hero: {
      title: 'Protect Your Crops with AI',
      subtitle: 'Advanced disease detection and fertilizer recommendations powered by machine learning',
      uploadButton: 'Upload Image',
      captureButton: 'Capture Photo',
      analyzeButton: 'Analyze Crop'
    },
    analysis: {
      analyzing: 'Analyzing image...',
      diseaseDetected: 'Disease Detected',
      healthyPlant: 'Healthy Plant',
      confidence: 'Confidence',
      recommendations: 'Fertilizer Recommendations',
      treatmentPlan: 'Treatment Plan'
    },
    diseases: {
      'tomato_blight': 'Tomato Blight',
      'wheat_rust': 'Wheat Rust',
      'corn_smut': 'Corn Smut',
      'potato_scab': 'Potato Scab',
      'rice_blast': 'Rice Blast',
      'healthy': 'Healthy Plant'
    },
    fertilizers: {
      'copper_fungicide': 'Copper Fungicide',
      'organic_compost': 'Organic Compost',
      'potassium_fertilizer': 'Potassium Fertilizer',
      'nitrogen_supplement': 'Nitrogen Supplement',
      'phosphorus_boost': 'Phosphorus Boost'
    },
    common: {
      language: 'Language',
      loading: 'Loading...',
      tryAgain: 'Try Again',
      newAnalysis: 'New Analysis'
    }
  },
  hi: {
    appName: 'एग्रोसेंस',
    tagline: 'AI-संचालित पौधों के रोग की पहचान',
    hero: {
      title: 'AI के साथ अपनी फसलों की रक्षा करें',
      subtitle: 'मशीन लर्निंग द्वारा संचालित उन्नत रोग पहचान और उर्वरक सुझाव',
      uploadButton: 'चित्र अपलोड करें',
      captureButton: 'फोटो खींचें',
      analyzeButton: 'फसल का विश्लेषण करें'
    },
    analysis: {
      analyzing: 'चित्र का विश्लेषण कर रहे हैं...',
      diseaseDetected: 'रोग की पहचान',
      healthyPlant: 'स्वस्थ पौधा',
      confidence: 'विश्वास',
      recommendations: 'उर्वरक सुझाव',
      treatmentPlan: 'उपचार योजना'
    },
    diseases: {
      'tomato_blight': 'टमाटर की झुलसन',
      'wheat_rust': 'गेहूं का रतुआ',
      'corn_smut': 'मक्का का कंड',
      'potato_scab': 'आलू की पपड़ी',
      'rice_blast': 'चावल की झुलसन',
      'healthy': 'स्वस्थ पौधा'
    },
    fertilizers: {
      'copper_fungicide': 'कॉपर फफूंदनाशी',
      'organic_compost': 'जैविक खाद',
      'potassium_fertilizer': 'पोटेशियम उर्वरक',
      'nitrogen_supplement': 'नाइट्रोजन सप्लीमेंट',
      'phosphorus_boost': 'फास्फोरस बूस्ट'
    },
    common: {
      language: 'भाषा',
      loading: 'लोड हो रहा है...',
      tryAgain: 'पुनः प्रयास करें',
      newAnalysis: 'नया विश्लेषण'
    }
  },
  mr: {
    appName: 'एग्रोसेन्स',
    tagline: 'AI-संचालित वनस्पती रोग ओळख',
    hero: {
      title: 'AI सह आपल्या पिकांचे संरक्षण करा',
      subtitle: 'मशीन लर्निंगद्वारे संचालित प्रगत रोग ओळख आणि खत सुचवणे',
      uploadButton: 'चित्र अपलोड करा',
      captureButton: 'फोटो काढा',
      analyzeButton: 'पीक विश्लेषण करा'
    },
    analysis: {
      analyzing: 'चित्राचे विश्लेषण करत आहे...',
      diseaseDetected: 'रोग आढळला',
      healthyPlant: 'निरोगी वनस्पती',
      confidence: 'विश्वास',
      recommendations: 'खत सुचवणे',
      treatmentPlan: 'उपचार योजना'
    },
    diseases: {
      'tomato_blight': 'टोमॅटो ब्लाइट',
      'wheat_rust': 'गव्हाचा गंज',
      'corn_smut': 'मका स्मट',
      'potato_scab': 'बटाटा स्कॅब',
      'rice_blast': 'तांदूळ ब्लास्ट',
      'healthy': 'निरोगी वनस्पती'
    },
    fertilizers: {
      'copper_fungicide': 'कॉपर बुरशीनाशक',
      'organic_compost': 'सेंद्रिय खत',
      'potassium_fertilizer': 'पोटॅशियम खत',
      'nitrogen_supplement': 'नायट्रोजन सप्लिमेंट',
      'phosphorus_boost': 'फॉस्फरस बूस्ट'
    },
    common: {
      language: 'भाषा',
      loading: 'लोड होत आहे...',
      tryAgain: 'पुन्हा प्रयत्न करा',
      newAnalysis: 'नवीन विश्लेषण'
    }
  },
  gu: {
    appName: 'એગ્રોસેન્સ',
    tagline: 'AI-સંચાલિત છોડના રોગની ઓળખ',
    hero: {
      title: 'AI સાથે તમારા પાકનું રક્ષણ કરો',
      subtitle: 'મશીન લર્નિંગ દ્વારા સંચાલિત અદ્યતન રોગ ઓળખ અને ખાતર સૂચનો',
      uploadButton: 'ચિત્ર અપલોડ કરો',
      captureButton: 'ફોટો લો',
      analyzeButton: 'પાક વિશ્લેષણ કરો'
    },
    analysis: {
      analyzing: 'ચિત્રનું વિશ્લેષણ કરી રહ્યા છીએ...',
      diseaseDetected: 'રોગ મળ્યો',
      healthyPlant: 'સ્વસ્થ છોડ',
      confidence: 'વિશ્વાસ',
      recommendations: 'ખાતર સૂચનો',
      treatmentPlan: 'સારવાર યોજના'
    },
    diseases: {
      'tomato_blight': 'ટમેટા બ્લાઇટ',
      'wheat_rust': 'ઘઉંનો કાટ',
      'corn_smut': 'મકાઈ સ્મટ',
      'potato_scab': 'બટાકા સ્કેબ',
      'rice_blast': 'ચોખા બ્લાસ્ટ',
      'healthy': 'સ્વસ્થ છોડ'
    },
    fertilizers: {
      'copper_fungicide': 'કોપર ફંગીસાઇડ',
      'organic_compost': 'કાર્બનિક ખાતર',
      'potassium_fertilizer': 'પોટેશિયમ ખાતર',
      'nitrogen_supplement': 'નાઇટ્રોજન સપ્લિમેંટ',
      'phosphorus_boost': 'ફોસ્ફરસ બૂસ્ટ'
    },
    common: {
      language: 'ભાષા',
      loading: 'લોડ થઈ રહ્યું છે...',
      tryAgain: 'ફરી પ્રયાસ કરો',
      newAnalysis: 'નવું વિશ્લેષણ'
    }
  },
  ta: {
    appName: 'அக்ரோசென்ஸ்',
    tagline: 'AI-இயங்கும் தாவர நோய் கண்டறிதல்',
    hero: {
      title: 'AI உடன் உங்கள் பயிர்களைப் பாதுகாக்கவும்',
      subtitle: 'இயந்திர கற்றல் மூலம் இயக்கப்படும் மேம்பட்ட நோய் கண்டறிதல் மற்றும் உர பரிந்துரைகள்',
      uploadButton: 'படம் பதிவேற்று',
      captureButton: 'புகைப்படம் எடு',
      analyzeButton: 'பயிர் பகுப்பாய்வு'
    },
    analysis: {
      analyzing: 'படத்தை பகுப்பாய்வு செய்கிறது...',
      diseaseDetected: 'நோய் கண்டறியப்பட்டது',
      healthyPlant: 'ஆரோக்கியமான தாவரம்',
      confidence: 'நம்பிக்கை',
      recommendations: 'உர பரிந்துரைகள்',
      treatmentPlan: 'சிகிச்சை திட்டம்'
    },
    diseases: {
      'tomato_blight': 'தக்காளி ப்ளைட்',
      'wheat_rust': 'கோதுமை துரு',
      'corn_smut': 'சோள ஸ்மட்',
      'potato_scab': 'உருளைக்கிழங்கு ஸ்கேப்',
      'rice_blast': 'அரிசி ப்ளாஸ்ட்',
      'healthy': 'ஆரோக்கியமான தாவரம்'
    },
    fertilizers: {
      'copper_fungicide': 'காப்பர் பூஞ்சைக்கொல்லி',
      'organic_compost': 'கரிம உரம்',
      'potassium_fertilizer': 'பொட்டாசியம் உரம்',
      'nitrogen_supplement': 'நைட்ரஜன் சப்ளிமெண்ட்',
      'phosphorus_boost': 'பாஸ்பரஸ் பூஸ்ட்'
    },
    common: {
      language: 'மொழி',
      loading: 'ஏற்றுகிறது...',
      tryAgain: 'மீண்டும் முயற்சிக்கவும்',
      newAnalysis: 'புதிய பகுப்பாய்வு'
    }
  }
} as const;