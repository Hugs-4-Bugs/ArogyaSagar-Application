
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  reviewsList?: Review[];
  benefits: string[];
  ingredients: string[];
  inStock: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  image: string;
  available: boolean;
  price: number;
  rating: number;
  bio: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  dateAdded: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read' | 'error';
}

export interface Therapy {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  image: string;
}

export interface WellnessTip {
  id: string;
  title: string;
  content: string;
  category: 'Lifestyle' | 'Diet' | 'Mindfulness';
  image: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: string;
  calories: number;
  ingredients: string[];
  instructions: string[]; 
  benefits: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  address?: Address;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorImage: string;
  date: string; // ISO Date string
  time: string; // e.g., "10:00 AM"
  status: 'scheduled' | 'completed' | 'cancelled';
  transcript?: string; // AI Generated transcript
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
