export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images: string[];
    category: string;
    rating: number;
    reviewCount: number;
    description: string;
    ingredients: string[];
    benefits: string[];
    howToUse: string[];
    precautions: string[];
    inStock: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    joinDate: string;
  }
  
  export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    userName: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    createdAt: string;
  }
  
  export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }
  
  export const categories = [
    'All Products',
    'Digestive Health',
    'Skin Care',
    'Immunity Boost',
    'Hair Care',
    'Joint & Muscle',
    'Respiratory',
    'Mental Wellness'
  ];
  
  export const products: Product[] = [
    {
      id: '1',
      name: 'Triphala Capsules',
      price: 2074.17,
      originalPrice: 2489.17,
      image: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4021840/pexels-photo-4021840.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Digestive Health',
      rating: 4.8,
      reviewCount: 324,
  description: 'Premium Triphala capsules made from organic Amalaki, Bibhitaki, and Haritaki fruits. This traditional herbal formula supports digestive health and gentle detoxification.',
      ingredients: ['Organic Amalaki fruit', 'Organic Bibhitaki fruit', 'Organic Haritaki fruit', 'Vegetable cellulose capsule'],
      benefits: [
        'Supports healthy digestion',
        'Promotes natural detoxification',
        'Rich in antioxidants',
        'Supports regular bowel movements',
        'Balances all three doshas'
      ],
      howToUse: [
        'Take 1-2 capsules twice daily with warm water',
        'Best taken 30 minutes before meals',
        'For optimal results, use consistently for 3 months'
      ],
      precautions: [
        'Consult healthcare provider if pregnant or nursing',
        'Not recommended for children under 12',
        'Discontinue if any adverse reactions occur'
      ],
      inStock: true
    },
    {
      id: '2',
      name: 'Turmeric Golden Milk Powder',
      price: 1659.17,
      image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4198031/pexels-photo-4198031.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Immunity Boost',
      rating: 4.9,
      reviewCount: 567,
      description: 'Authentic golden milk blend with organic turmeric, warming spices, and coconut milk powder. A traditional recipe for daily wellness and immune support.',
      ingredients: ['Organic turmeric root', 'Organic ginger', 'Organic cinnamon', 'Organic cardamom', 'Black pepper', 'Coconut milk powder'],
      benefits: [
        'Powerful anti-inflammatory properties',
        'Supports immune system',
        'Promotes restful sleep',
        'Rich in antioxidants',
        'Aids in recovery and healing'
      ],
      howToUse: [
        'Mix 1 teaspoon with 1 cup warm milk or plant milk',
        'Stir well and add honey if desired',
        'Best consumed in the evening before bed'
      ],
      precautions: [
        'May interact with blood-thinning medications',
        'Consult doctor if you have gallstones',
        'Reduce quantity if stomach sensitivity occurs'
      ],
      inStock: true
    },
    {
      id: '3',
      name: 'Neem Face Wash',
      price: 1410.17,
      originalPrice: 1825.17,
      image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4465131/pexels-photo-4465131.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Skin Care',
      rating: 4.6,
      reviewCount: 892,
      description: 'Gentle yet effective face wash infused with pure neem extract and natural botanicals. Perfect for oily and acne-prone skin.',
      ingredients: ['Neem leaf extract', 'Aloe vera gel', 'Tea tree oil', 'Coconut oil', 'Glycerin', 'Natural surfactants'],
      benefits: [
        'Deep cleanses pores',
        'Controls excess oil production',
        'Prevents acne and breakouts',
        'Soothes irritated skin',
        'Maintains skin pH balance'
      ],
      howToUse: [
        'Wet face with lukewarm water',
        'Apply small amount and gently massage',
        'Rinse thoroughly and pat dry',
        'Use twice daily for best results'
      ],
      precautions: [
        'Avoid contact with eyes',
        'Discontinue if irritation occurs',
        'Patch test before first use'
      ],
      inStock: true
    },
    {
      id: '4',
      name: 'Brahmi Hair Oil',
      price: 1908.17,
      image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4041401/pexels-photo-4041401.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Hair Care',
      rating: 4.7,
      reviewCount: 445,
  description: 'Nourishing hair oil enriched with Brahmi, Bhringraj, and other herbal ingredients. Promotes healthy hair growth and scalp wellness.',
      ingredients: ['Brahmi extract', 'Bhringraj oil', 'Amla oil', 'Coconut oil', 'Sesame oil', 'Fenugreek extract'],
      benefits: [
        'Promotes hair growth',
        'Reduces hair fall',
        'Nourishes scalp',
        'Prevents premature graying',
        'Adds natural shine and strength'
      ],
      howToUse: [
        'Apply to scalp and hair length',
        'Gently massage for 5-10 minutes',
        'Leave for 30 minutes or overnight',
        'Wash with mild shampoo'
      ],
      precautions: [
        'Patch test recommended',
        'Avoid if allergic to any ingredients',
        'Store in cool, dry place'
      ],
      inStock: true
    },
    {
      id: '5',
      name: 'Ashwagandha Stress Relief',
      price: 2406.17,
      image: 'https://images.pexels.com/photos/4021815/pexels-photo-4021815.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/4021815/pexels-photo-4021815.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4021832/pexels-photo-4021832.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Mental Wellness',
      rating: 4.9,
      reviewCount: 678,
      description: 'Premium Ashwagandha root extract standardized to contain high levels of withanolides. Supports stress management and overall vitality.',
      ingredients: ['Organic Ashwagandha root extract (5% withanolides)', 'Black pepper extract', 'Vegetable cellulose capsule'],
      benefits: [
        'Reduces stress and anxiety',
        'Supports healthy sleep patterns',
        'Boosts energy and vitality',
        'Enhances mental clarity',
        'Supports adrenal function'
      ],
      howToUse: [
        'Take 1 capsule twice daily with meals',
        'Start with lower dose if sensitive',
        'Best results after 4-6 weeks of consistent use'
      ],
      precautions: [
        'Not recommended during pregnancy',
        'May interact with certain medications',
        'Consult healthcare provider before use'
      ],
      inStock: true
    },
    {
      id: '6',
      name: 'Joint Support Formula',
      price: 2904.17,
      originalPrice: 3319.17,
      image: 'https://images.pexels.com/photos/4021762/pexels-photo-4021762.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/4021762/pexels-photo-4021762.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4021789/pexels-photo-4021789.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Joint & Muscle',
      rating: 4.5,
      reviewCount: 234,
      description: 'Comprehensive joint support blend featuring Boswellia, Turmeric, and other traditional herbs for mobility and comfort.',
      ingredients: ['Boswellia serrata extract', 'Turmeric root extract', 'Ginger root', 'Guggul extract', 'Black pepper extract'],
      benefits: [
        'Supports joint flexibility',
        'Reduces inflammation',
        'Promotes mobility',
        'Supports cartilage health',
        'Natural pain management'
      ],
      howToUse: [
        'Take 2 capsules daily with food',
        'Allow 4-6 weeks for full benefits',
        'Can be taken with other supplements'
      ],
      precautions: [
        'Consult doctor if taking blood thinners',
        'Not recommended for pregnant women',
        'Monitor if you have stomach sensitivity'
      ],
      inStock: true
    }
  ];
  
  export const users: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      joinDate: '2024-02-03'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      joinDate: '2024-02-20'
    },
    {
      id: '4',
      name: 'David Kumar',
      email: 'david.kumar@email.com',
      joinDate: '2024-03-10'
    }
  ];
  
  export const orders: Order[] = [
    {
      id: 'ORD-001',
      userId: '1',
      userName: 'Sarah Johnson',
      items: [
        { productId: '1', quantity: 2, price: 2074.17 },
        { productId: '2', quantity: 1, price: 1659.17 }
      ],
      total: 5807.51,
      status: 'delivered',
      createdAt: '2024-03-01'
    },
    {
      id: 'ORD-002',
      userId: '2',
      userName: 'Michael Chen',
      items: [
        { productId: '3', quantity: 1, price: 1410.17 },
        { productId: '5', quantity: 1, price: 2406.17 }
      ],
      total: 3816.34,
      status: 'shipped',
      createdAt: '2024-03-05'
    },
    {
      id: 'ORD-003',
      userId: '3',
      userName: 'Emily Rodriguez',
      items: [
        { productId: '4', quantity: 1, price: 1908.17 }
      ],
      total: 1908.17,
      status: 'confirmed',
      createdAt: '2024-03-08'
    },
    {
      id: 'ORD-004',
      userId: '4',
      userName: 'David Kumar',
      items: [
        { productId: '6', quantity: 1, price: 2904.17 },
        { productId: '1', quantity: 1, price: 2074.17 }
      ],
      total: 4978.34,
      status: 'pending',
      createdAt: '2024-03-12'
    }
  ];
  
  export const testimonials = [
    {
      id: '1',
      name: 'Priya Sharma',
      text: 'The Triphala capsules have completely transformed my digestive health. I feel more energetic and balanced every day.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      name: 'James Wilson',
      text: 'I\'ve been using the Golden Milk powder for months now. My sleep quality has improved dramatically, and I wake up feeling refreshed.',
      rating: 5,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '3',
      name: 'Maria Garcia',
      text: 'The Neem face wash cleared up my acne within weeks. My skin has never looked better, and it feels so gentle and natural.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];