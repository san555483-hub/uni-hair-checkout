export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export const SERVICES: Service[] = [
  { 
    id: '1', 
    name: '剪髮', 
    description: '專業剪髮服務', 
    price: 500,
    category: '基礎服務'
  },
  { 
    id: '2', 
    name: '燙髮', 
    description: '各式燙髮造型', 
    price: 1200,
    category: '造型服務'
  },
  { 
    id: '3', 
    name: '染髮', 
    description: '專業染髮服務', 
    price: 1500,
    category: '造型服務'
  },
  { 
    id: '4', 
    name: '護髮', 
    description: '深層護理療程', 
    price: 800,
    category: '護理服務'
  },
  { 
    id: '5', 
    name: '頭皮護理', 
    description: '頭皮清潔護理', 
    price: 600,
    category: '護理服務'
  },
  { 
    id: '6', 
    name: '造型設計', 
    description: '專業造型設計', 
    price: 900,
    category: '基礎服務'
  },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: '現金', icon: '💵' },
  { id: 'card', name: '信用卡', icon: '💳' },
  { id: 'mobile', name: '行動支付', icon: '📱' },
];
