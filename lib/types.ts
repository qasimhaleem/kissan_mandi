export interface FarmerProfile {
  farmSizeAcres?: number;
  primaryCrops?: string[];
  experienceYears?: number;
  farmAddress?: string;
  cnic?: string;
}

export interface BuyerProfile {
  businessName?: string;
  buyerType?: 'wholesaler' | 'retailer' | 'exporter' | 'processor' | 'individual';
  ntnNumber?: string;
  deliveryAddress?: string;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
  role: 'farmer' | 'buyer' | 'admin';
  district: string;
  language: 'ur' | 'en';
  status?: 'active' | 'suspended' | 'pending';
  isVerified?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;
  token?: string;
  refreshToken?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  unit: 'KG' | 'Maund' | 'Ton' | 'Bale' | 'Crate' | 'Bag' | string;
  quantity: number;
  minOrder: number;
  location: {
    district: string;
    address?: string;
    type?: string;
    coordinates?: [number, number];
  };
  images: string[];
  status: 'active' | 'paused' | 'sold_out' | 'closed';
  views: number;
  inquiriesCount: number;
  farmer: {
    _id: string;
    id?: string;
    name: string;
    phone: string;
    email?: string;
    district: string;
    farmerProfile?: FarmerProfile;
    createdAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  _id: string;
  farmer: {
    _id: string;
    name: string;
    phone: string;
    district: string;
  };
  crop: string;
  quantity: number;
  unit: 'kg' | 'maund' | 'ton';
  basePrice: number;
  images: [string, string];
  location: {
    type: 'Point';
    coordinates: [number, number];
    district: string;
  };
  endsAt: string;
  status: 'active' | 'closed' | 'sold';
  highestBid: number;
  winner?: {
    _id: string;
    name: string;
    phone: string;
  };
  createdAt: string;
}

export interface Bid {
  _id: string;
  listing: string | Listing;
  buyer: {
    _id: string;
    name: string;
    phone: string;
    district: string;
  };
  amount: number;
  createdAt: string;
}
