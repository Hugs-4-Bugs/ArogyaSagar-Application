
import { Product, Doctor, Therapy, WellnessTip, Recipe } from './types';

// --- PRODUCT GENERATION ENGINE ---
// Expanded image sets for better variety and visual accuracy

const CATEGORY_DATA: Record<string, { images: string[], bases: string[], adjectives: string[], priceRange: [number, number] }> = {
  'Immunity & Energy': {
    images: [
      'https://images.unsplash.com/photo-1512069772995-ec65ed456eb3?q=80&w=600&auto=format&fit=crop', // Herbs in jar
      'https://images.unsplash.com/photo-1546843825-ac63b5e31fa9?q=80&w=600&auto=format&fit=crop', // Herbal powder
      'https://images.unsplash.com/photo-1629196911514-cfd8d628b26e?q=80&w=600&auto=format&fit=crop'  // Pills/Capsules
    ],
    bases: ['Ashwagandha', 'Shilajit', 'Chyawanprash', 'Giloy', 'Amla', 'Moringa', 'Spirulina', 'Ginseng', 'Turmeric Curcumin', 'Immunity Drops'],
    adjectives: ['Gold', 'Premium', 'Organic', 'Pure', 'Vitality', 'Power', 'Daily', 'Forte', 'Max', 'Ultra'],
    priceRange: [399, 1299]
  },
  'General Wellness': {
    images: [
      'https://images.unsplash.com/photo-1626438865324-4f93318991b9?q=80&w=600&auto=format&fit=crop', // Ayurveda bottle
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop', // Green supplement
      'https://images.unsplash.com/photo-1615486511269-a7b5d513fa0e?q=80&w=600&auto=format&fit=crop'  // Natural medicine
    ],
    bases: ['Triphala', 'Neem', 'Aloe Vera', 'Wheatgrass', 'Gokshura', 'Manjistha', 'Brahmi', 'Shatavari', 'Punarnava', 'Liver Detox'],
    adjectives: ['Balance', 'Digest', 'Cleanse', 'Whole', 'Natural', 'Essentials', 'Care', 'Life', 'Veda', 'Roots'],
    priceRange: [199, 699]
  },
  'Herbal Teas': {
    images: [
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop', // Tea cup
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop', // Tea leaves
      'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=600&auto=format&fit=crop', // Tea pouring
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?q=80&w=600&auto=format&fit=crop'  // Green tea
    ],
    bases: ['Green Tea', 'Tulsi Tea', 'Chamomile Blend', 'Hibiscus Infusion', 'Ginger Cardamom', 'Masala Chai', 'Peppermint Detox', 'Jasmine Pearls', 'Lemon Grass', 'Sleep Tea'],
    adjectives: ['Himalayan', 'Calming', 'Energizing', 'Classic', 'Royal', 'Soothing', 'Detox', 'Slimming', 'Fresh', 'Aromatic'],
    priceRange: [250, 850]
  },
  'Organic Honey': {
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop', // Honey jar
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop', // Honeycomb
      'https://images.unsplash.com/photo-1612475498348-0702087933a3?q=80&w=600&auto=format&fit=crop'  // Honey stick
    ],
    bases: ['Wild Honey', 'Tulsi Honey', 'Multiflora Honey', 'Acacia Honey', 'Forest Raw Honey', 'Ginger Honey', 'Saffron Honey', 'Mustard Honey', 'Eucalyptus Honey', 'Berry Honey'],
    adjectives: ['Raw', 'Unfiltered', 'Pure', 'Golden', 'Sweet', 'Mountain', 'Wild', 'Organic', 'Nectar', 'Bee'],
    priceRange: [350, 1500]
  },
  'Essential Oils': {
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=600&auto=format&fit=crop', // Oil bottles
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop', // Dropper
      'https://images.unsplash.com/photo-1611079830811-865dd442616a?q=80&w=600&auto=format&fit=crop'  // Spa oil
    ],
    bases: ['Lavender Oil', 'Eucalyptus Oil', 'Peppermint Oil', 'Tea Tree Oil', 'Rosemary Oil', 'Lemongrass Oil', 'Sandalwood Oil', 'Frankincense', 'Jasmine Oil', 'Ylang Ylang'],
    adjectives: ['Therapeutic', 'Aromatic', 'Distilled', 'Essence', 'Calm', 'Pure', 'Extract', 'Elixir', 'Mood', 'Sense'],
    priceRange: [299, 1200]
  },
  'Spices & Superfoods': {
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop', // Turmeric powder
      'https://images.unsplash.com/photo-1532336414038-cf00d4797c59?q=80&w=600&auto=format&fit=crop', // Spices mix
      'https://images.unsplash.com/photo-1615485925694-a031e897137b?q=80&w=600&auto=format&fit=crop'  // Cinnamon
    ],
    bases: ['Turmeric Powder', 'Black Pepper', 'Cinnamon Sticks', 'Cardamom', 'Clove Buds', 'Saffron Strands', 'Chia Seeds', 'Flax Seeds', 'Quinoa', 'Moringa Powder'],
    adjectives: ['Organic', 'Whole', 'Ground', 'Premium', 'Export Quality', 'Farm Fresh', 'Authentic', 'Spicy', 'Rich', 'Flavor'],
    priceRange: [150, 2500]
  },
  'Hair & Skin Care': {
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=600&auto=format&fit=crop', // Cosmetic bottle
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600&auto=format&fit=crop', // Cream
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop'  // Soap
    ],
    bases: ['Face Wash', 'Hair Oil', 'Shampoo', 'Conditioner', 'Face Serum', 'Body Lotion', 'Face Pack', 'Hair Mask', 'Massage Oil', 'Soap'],
    adjectives: ['Glow', 'Radiance', 'Silk', 'Strong', 'Nourish', 'Hydrate', 'Clear', 'Soft', 'Revive', 'Shine'],
    priceRange: [250, 1500]
  },
  'Pain Relief': {
    images: [
      'https://images.unsplash.com/photo-1632517594943-40e9499dfd30?q=80&w=600&auto=format&fit=crop', // Cream tube
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'  // Medicine
    ],
    bases: ['Relief Oil', 'Balm', 'Spray', 'Capsules', 'Ointment', 'Gel', 'Patch', 'Roll-on', 'Tablet', 'Liniment'],
    adjectives: ['Fast Action', 'Deep', 'Instant', 'Muscle', 'Joint', 'Orthopedic', 'Strong', 'Advanced', 'Natural', 'Effective'],
    priceRange: [150, 800]
  },
  'Chronic Diseases': {
    images: [
      'https://images.unsplash.com/photo-1550572017-ed1086058d84?q=80&w=600&auto=format&fit=crop', // Pills
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop'  // Medicine bottle
    ],
    bases: ['Diabetes Care', 'BP Control', 'Cholesterol Aid', 'Thyroid Balance', 'Heart Care', 'Liver Support', 'Kidney Detox', 'Lung Care', 'Arthritis Aid', 'Sugar Balance'],
    adjectives: ['Control', 'Regulator', 'Support', 'Care', 'Health', 'Management', 'System', 'Guard', 'Shield', 'Defender'],
    priceRange: [400, 2000]
  },
  'Mental Wellness': {
    images: [
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=600&auto=format&fit=crop', // Calm tea
      'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600&auto=format&fit=crop'  // Meditation items
    ],
    bases: ['Brain Tonic', 'Focus Capsules', 'Sleep Aid', 'Stress Relief', 'Mood Enhancer', 'Memory Booster', 'Calm Drops', 'Relax Tea', 'Mind Power', 'Peace Tablets'],
    adjectives: ['Zen', 'Focus', 'Calm', 'Rest', 'Mind', 'Cognitive', 'Serenity', 'Bliss', 'Smart', 'Deep'],
    priceRange: [350, 1200]
  }
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  Object.entries(CATEGORY_DATA).forEach(([category, data]) => {
    // Generate ~20 items per category for diverse catalog
    for (let i = 0; i < 20; i++) {
      const base = data.bases[Math.floor(Math.random() * data.bases.length)];
      const adj = data.adjectives[Math.floor(Math.random() * data.adjectives.length)];
      const name = `${adj} ${base}`;
      const image = data.images[Math.floor(Math.random() * data.images.length)];
      const price = Math.floor(Math.random() * (data.priceRange[1] - data.priceRange[0])) + data.priceRange[0];
      const rating = parseFloat((4 + Math.random()).toFixed(1));
      const reviews = Math.floor(Math.random() * 500) + 10;

      products.push({
        id: idCounter.toString(),
        name,
        description: `Premium ${category.toLowerCase()} product. Authentic Ayurvedic formulation for holistic health using ${base}.`,
        price,
        category,
        image,
        rating,
        reviews,
        reviewsList: [],
        benefits: ['Natural Ingredients', 'Chemical Free', 'Doctor Verified', 'Holistic Cure'],
        ingredients: [base, 'Herbal Extract', 'Natural Preservatives'],
        inStock: true
      });
      idCounter++;
    }
  });

  return products;
};

export const PRODUCTS: Product[] = generateProducts();

// --- DOCTOR DATA ---
export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Aarav Sharma',
    specialty: 'Panchakarma Specialist',
    experience: 15,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
    available: true,
    price: 1500,
    rating: 4.9,
    bio: 'Expert in detoxification therapies and chronic lifestyle disorders.'
  },
  {
    id: 'd2',
    name: 'Dr. Priya Kapoor',
    specialty: 'Skin & Hair (Dermatology)',
    experience: 8,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop',
    available: true,
    price: 1000,
    rating: 4.7,
    bio: 'Specializes in Ayurvedic aesthetics and treating skin conditions naturally.'
  },
  {
    id: 'd3',
    name: 'Dr. Rajesh Gupta',
    specialty: 'General Ayurveda & Diabetes',
    experience: 20,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
    available: false,
    price: 1200,
    rating: 4.8,
    bio: 'Renowned for reversing Type-2 Diabetes through diet and herbs.'
  },
  {
    id: 'd4',
    name: 'Dr. Ananya Singh',
    specialty: 'Mental Wellness & Psychology',
    experience: 12,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    available: true,
    price: 1400,
    rating: 4.9,
    bio: 'Helping patients overcome anxiety and depression using Medhya Rasayanas and counseling.'
  },
  {
    id: 'd5',
    name: 'Dr. Vikram Malhotra',
    specialty: 'Sexual Wellness & Fertility',
    experience: 18,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    available: true,
    price: 2000,
    rating: 4.9,
    bio: 'Specialist in Vajikarana therapy for reproductive health and vitality.'
  },
  {
    id: 'd6',
    name: 'Dr. Sunita Rao',
    specialty: 'Diet & Nutrition (Ahaar Vihar)',
    experience: 10,
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=800&auto=format&fit=crop',
    available: true,
    price: 800,
    rating: 4.6,
    bio: 'Curating personalized Ayurvedic diet plans for weight management and gut health.'
  }
];

// --- THERAPIES ---
export const THERAPIES: Therapy[] = [
  {
    id: 't1',
    name: 'Abhyanga',
    duration: '60 mins',
    price: 2500,
    description: 'Full body massage with warm herbal oils to rejuvenate the body and mind.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 't2',
    name: 'Shirodhara',
    duration: '45 mins',
    price: 3000,
    description: 'Continuous pouring of warm oil on the forehead to relieve stress and improve sleep.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 't3',
    name: 'Panchakarma Detox',
    duration: '7 Days',
    price: 15000,
    description: 'Complete 5-stage detoxification process tailored to your dosha.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop'
  }
];

// --- WELLNESS TIPS ---
export const WELLNESS_TIPS: WellnessTip[] = [
  {
    id: 'w1',
    title: 'Start with Warm Water',
    content: 'Drink a glass of warm water with a squeeze of lemon immediately after waking up to flush out toxins and kickstart digestion.',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed456eb3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'w2',
    title: 'Oil Pulling (Gandusha)',
    content: 'Swish sesame or coconut oil in your mouth for 5-10 minutes daily to improve oral health and draw out impurities.',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1606859191214-25806e8e2423?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'w3',
    title: 'Eat with the Sun',
    content: 'Consume your largest meal at noon when the sun is highest, as your digestive fire (Agni) is strongest at this time.',
    category: 'Diet',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=600&auto=format&fit=crop'
  }
];

// --- RECIPES ---
export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Golden Milk (Haldi Doodh)',
    description: 'A soothing immunity-boosting drink perfect for bedtime.',
    image: 'https://images.unsplash.com/photo-1515594276707-c956e18f8f2b?q=80&w=600&auto=format&fit=crop',
    prepTime: '10 mins',
    calories: 120,
    ingredients: ['1 cup Milk (or Almond Milk)', '1/2 tsp Turmeric', 'Pinch of Black Pepper', '1 tsp Honey'],
    instructions: [
      'Pour milk into a small saucepan and heat over medium heat.',
      'Add turmeric and black pepper. Whisk to combine.',
      'Bring to a gentle simmer (do not boil) and let it simmer for 5 minutes.',
      'Remove from heat and stir in honey or maple syrup.',
      'Strain if desired and serve warm.'
    ],
    benefits: ['Anti-inflammatory', 'Improves Sleep', 'Boosts Immunity']
  },
  {
    id: 'r2',
    name: 'Ayurvedic Kitchari',
    description: 'The ultimate detox meal made with mung beans and rice, easily digestible.',
    image: 'https://images.unsplash.com/photo-1631515243349-e0603f4879e6?q=80&w=600&auto=format&fit=crop',
    prepTime: '30 mins',
    calories: 350,
    ingredients: ['1/2 cup Basmati Rice', '1/2 cup Mung Dal', '1 tbsp Ghee', '1/2 tsp Cumin Seeds', '1/2 tsp Coriander Powder', '1/2 tsp Turmeric', '4 cups Water'],
    instructions: [
      'Rinse rice and dal until water runs clear.',
      'In a pot, heat ghee over medium heat. Add cumin seeds and let them sizzle.',
      'Add turmeric and coriander powder. Stir briefly.',
      'Add the rinsed rice and dal. Sauté for 1-2 minutes.',
      'Pour in water and bring to a boil. Reduce heat, cover, and simmer for 20-25 minutes until soft.',
      'Add salt to taste and garnish with fresh cilantro.'
    ],
    benefits: ['Balances all Doshas', 'Easy to Digest', 'Detoxifying']
  },
  {
    id: 'r3',
    name: 'Digestive CCF Tea',
    description: 'Cumin, Coriander, and Fennel tea to debloat and improve metabolism.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop',
    prepTime: '5 mins',
    calories: 5,
    ingredients: ['1/2 tsp Cumin seeds', '1/2 tsp Coriander seeds', '1/2 tsp Fennel seeds', '2 cups Water'],
    instructions: [
      'Bring 2 cups of water to a boil in a kettle or pot.',
      'Add the cumin, coriander, and fennel seeds.',
      'Reduce heat and let it simmer for 5-10 minutes.',
      'Strain the seeds and pour the tea into a mug.',
      'Sip slowly while warm.'
    ],
    benefits: ['Relieves Bloating', 'Improves Metabolism', 'Cooling effect']
  }
];

// --- CONCERNS ---
export const CONCERNS = [
  { id: 'c1', name: 'Digestion', image: 'https://images.unsplash.com/photo-1550572017-ed1086058d84?q=80&w=300&auto=format&fit=crop' },
  { id: 'c2', name: 'Stress & Sleep', image: 'https://images.unsplash.com/photo-1515023115689-589c33041697?q=80&w=300&auto=format&fit=crop' },
  { id: 'c3', name: 'Skin & Hair', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=300&auto=format&fit=crop' },
  { id: 'c4', name: 'Joint Pain', image: 'https://images.unsplash.com/photo-1574482620262-b61e27502a9e?q=80&w=300&auto=format&fit=crop' },
  { id: 'c5', name: 'Immunity', image: 'https://images.unsplash.com/photo-1611079830811-865dd442616a?q=80&w=300&auto=format&fit=crop' },
  { id: 'c6', name: 'Diabetes', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop' }
];

// --- QUIZ DATA ---
export const DOSHA_QUIZ = {
  questions: [
    {
      id: 1,
      text: "How would you describe your body frame?",
      options: [
        { text: "Thin, lean, hard to gain weight", type: "Vata" },
        { text: "Medium build, muscular", type: "Pitta" },
        { text: "Large build, gain weight easily", type: "Kapha" }
      ]
    },
    {
      id: 2,
      text: "How is your skin usually?",
      options: [
        { text: "Dry, rough, or cold", type: "Vata" },
        { text: "Sensitive, reddish, or warm", type: "Pitta" },
        { text: "Oily, smooth, or cool", type: "Kapha" }
      ]
    },
    {
      id: 3,
      text: "How is your temperament?",
      options: [
        { text: "Energetic, creative, anxious", type: "Vata" },
        { text: "Focused, intense, irritable", type: "Pitta" },
        { text: "Calm, steady, slow to anger", type: "Kapha" }
      ]
    },
    {
      id: 4,
      text: "How is your digestion?",
      options: [
        { text: "Irregular, prone to gas/bloating", type: "Vata" },
        { text: "Strong, get hungry easily", type: "Pitta" },
        { text: "Slow, feel heavy after eating", type: "Kapha" }
      ]
    }
  ],
  results: {
    Vata: {
      title: "Vata Dominant",
      desc: "You are governed by Air & Ether. You are creative and energetic but prone to anxiety and dryness. Focus on warmth, grounding foods, and routine.",
      recommendations: ['1', '3', '6']
    },
    Pitta: {
      title: "Pitta Dominant",
      desc: "You are governed by Fire & Water. You are ambitious and focused but prone to inflammation and acidity. Focus on cooling foods and relaxation.",
      recommendations: ['2', '4']
    },
    Kapha: {
      title: "Kapha Dominant",
      desc: "You are governed by Earth & Water. You are calm and loyal but prone to lethargy and weight gain. Focus on spicy foods and regular exercise.",
      recommendations: ['1', '5']
    }
  }
};
