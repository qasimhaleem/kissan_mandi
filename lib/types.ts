export interface User {
  _id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer';
  district: string;
  language: 'ur' | 'en';
  coordinates: {
    lat: number;
    lng: number;
  };
  token?: string;
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

