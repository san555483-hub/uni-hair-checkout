import React, { createContext, useContext, useState, useEffect } from 'react';

export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'select';

export interface Field {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // 用於 select 類型
}

export interface Service {
  id: string;
  [key: string]: any;
}

interface FieldsContextType {
  fields: Field[];
  services: Service[];
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: string, field: Omit<Field, 'id'>) => void;
  deleteField: (id: string) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Service) => void;
  deleteService: (id: string) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const FieldsContext = createContext<FieldsContextType | undefined>(undefined);

const DEFAULT_FIELDS: Field[] = [
  { id: 'name', name: 'name', label: '服務名稱', type: 'text', required: true },
  { id: 'description', name: 'description', label: '服務描述', type: 'textarea', required: false },
  { id: 'price', name: 'price', label: '價格', type: 'number', required: true },
  { id: 'category', name: 'category', label: '分類', type: 'text', required: false },
  { id: 'available', name: 'available', label: '是否可用', type: 'checkbox', required: false },
  { id: 'notes', name: 'notes', label: '特殊說明', type: 'textarea', required: false },
];

const DEFAULT_SERVICES: Service[] = [
  // ── CUT 剪髮 ──
  {
    id: '1',
    name: '一對一訂製設計剪髮',
    description: '不分年齡｜親子友善｜兒童專屬座椅｜小禮物',
    price: 699,
    category: '剪髮',
    available: true,
    notes: '30–40 分鐘',
  },

  // ── SHAMPOO 舒壓洗髮／自備 ──
  {
    id: '2',
    name: '自備洗髮',
    description: '自備洗髮服務',
    price: 360,
    category: '舒壓洗髮／自備',
    available: true,
    notes: '',
  },
  {
    id: '3',
    name: '自備洗護',
    description: '自備洗護服務',
    price: 440,
    category: '舒壓洗髮／自備',
    available: true,
    notes: '40–60 分鐘',
  },
  {
    id: '4',
    name: '店選購自備結構型護髮（工本費）',
    description: '店家選購自備結構型護髮，僅收工本費',
    price: 300,
    category: '舒壓洗髮／自備',
    available: true,
    notes: '',
  },

  // ── AROMA 訂製香氛舒壓洗護 ──
  {
    id: '5',
    name: '深度極致放鬆',
    description: '含頭部按摩＋眼部舒壓｜舒敏豐盈洗髮＋頭皮頭髮液｜深度保濕洗髮＋頭皮頭髮液',
    price: 659,
    category: '訂製香氛舒壓洗護',
    available: true,
    notes: '',
  },
  {
    id: '6',
    name: '8 分鐘香氛髮膜（升級修護）',
    description: '訂製香氛舒壓洗護升級修護',
    price: 919,
    category: '訂製香氛舒壓洗護',
    available: true,
    notes: '',
  },
  {
    id: '7',
    name: '奇蹟再生還原霜（升級修護）',
    description: '訂製香氛舒壓洗護升級修護',
    price: 1359,
    category: '訂製香氛舒壓洗護',
    available: true,
    notes: '',
  },

  // ── SCALP 頭皮管理（卡碧兒）──
  {
    id: '8',
    name: '頭皮管理－初階護理',
    description: '卡碧兒頭皮管理初階護理',
    price: 799,
    category: '頭皮管理',
    available: true,
    notes: '',
  },
  {
    id: '9',
    name: '頭皮管理－中階護理',
    description: '卡碧兒頭皮管理中階護理',
    price: 999,
    category: '頭皮管理',
    available: true,
    notes: '',
  },
  {
    id: '10',
    name: '頭皮管理－高階護理',
    description: '卡碧兒頭皮管理高階護理',
    price: 1349,
    category: '頭皮管理',
    available: true,
    notes: '',
  },
  {
    id: '11',
    name: '燙髮頭皮防護',
    description: '卡碧兒燙髮頭皮防護',
    price: 1200,
    category: '頭皮管理',
    available: true,
    notes: '',
  },

  // ── COLOR & PERM 染／燙 ──
  {
    id: '12',
    name: '質髮髮束檢測',
    description: '職人漂髮／白髮髮妝染（不分年齡）｜結構重建燙（不分年齡）｜均依髮況、需求、長度報價｜染或燙髮折抵 300 元',
    price: 800,
    category: '染／燙',
    available: true,
    notes: '染或燙髮折抵 300 元',
  },

  // ── TREATMENT 護髮 ──
  {
    id: '13',
    name: '滋養型 奇蹟還原霜－短',
    description: '滋養型奇蹟還原霜護髮（肩上）',
    price: 600,
    category: '護髮',
    available: true,
    notes: '肩上',
  },
  {
    id: '14',
    name: '滋養型 奇蹟還原霜－長',
    description: '滋養型奇蹟還原霜護髮（肩下）',
    price: 1200,
    category: '護髮',
    available: true,
    notes: '肩下',
  },

  // 結構型 光纖護髮
  {
    id: '15',
    name: '結構型 光纖護髮－短（會員）',
    description: '結構型光纖護髮，短髮，會員價',
    price: 1400,
    category: '護髮',
    available: true,
    notes: '短髮｜會員',
  },
  {
    id: '16',
    name: '結構型 光纖護髮－短（非會員）',
    description: '結構型光纖護髮，短髮，非會員價',
    price: 1500,
    category: '護髮',
    available: true,
    notes: '短髮｜非會員',
  },
  {
    id: '17',
    name: '結構型 光纖護髮－中（會員）',
    description: '結構型光纖護髮，中髮，會員價',
    price: 1500,
    category: '護髮',
    available: true,
    notes: '中髮｜會員',
  },
  {
    id: '18',
    name: '結構型 光纖護髮－中（非會員）',
    description: '結構型光纖護髮，中髮，非會員價',
    price: 1600,
    category: '護髮',
    available: true,
    notes: '中髮｜非會員',
  },
  {
    id: '19',
    name: '結構型 光纖護髮－中長（會員）',
    description: '結構型光纖護髮，中長髮，會員價',
    price: 1600,
    category: '護髮',
    available: true,
    notes: '中長髮｜會員',
  },
  {
    id: '20',
    name: '結構型 光纖護髮－中長（非會員）',
    description: '結構型光纖護髮，中長髮，非會員價',
    price: 1700,
    category: '護髮',
    available: true,
    notes: '中長髮｜非會員',
  },
  {
    id: '21',
    name: '結構型 光纖護髮－特長（會員）',
    description: '結構型光纖護髮，特長髮，會員價',
    price: 1700,
    category: '護髮',
    available: true,
    notes: '特長髮｜會員',
  },
  {
    id: '22',
    name: '結構型 光纖護髮－特長（非會員）',
    description: '結構型光纖護髮，特長髮，非會員價',
    price: 1800,
    category: '護髮',
    available: true,
    notes: '特長髮｜非會員',
  },

  // 防斷型 DREAM
  {
    id: '23',
    name: '防斷型 DREAM－短（會員）',
    description: '防斷型 DREAM 護髮，短髮，會員價',
    price: 1800,
    category: '護髮',
    available: true,
    notes: '短髮｜會員',
  },
  {
    id: '24',
    name: '防斷型 DREAM－短（非會員）',
    description: '防斷型 DREAM 護髮，短髮，非會員價',
    price: 2000,
    category: '護髮',
    available: true,
    notes: '短髮｜非會員',
  },
  {
    id: '25',
    name: '防斷型 DREAM－中（會員）',
    description: '防斷型 DREAM 護髮，中髮，會員價',
    price: 2300,
    category: '護髮',
    available: true,
    notes: '中髮｜會員',
  },
  {
    id: '26',
    name: '防斷型 DREAM－中（非會員）',
    description: '防斷型 DREAM 護髮，中髮，非會員價',
    price: 2500,
    category: '護髮',
    available: true,
    notes: '中髮｜非會員',
  },
  {
    id: '27',
    name: '防斷型 DREAM－中長（會員）',
    description: '防斷型 DREAM 護髮，中長髮，會員價',
    price: 2800,
    category: '護髮',
    available: true,
    notes: '中長髮｜會員',
  },
  {
    id: '28',
    name: '防斷型 DREAM－中長（非會員）',
    description: '防斷型 DREAM 護髮，中長髮，非會員價',
    price: 3000,
    category: '護髮',
    available: true,
    notes: '中長髮｜非會員',
  },
  {
    id: '29',
    name: '防斷型 DREAM－特長（會員）',
    description: '防斷型 DREAM 護髮，特長髮，會員價',
    price: 3300,
    category: '護髮',
    available: true,
    notes: '特長髮｜會員',
  },
  {
    id: '30',
    name: '防斷型 DREAM－特長（非會員）',
    description: '防斷型 DREAM 護髮，特長髮，非會員價',
    price: 3500,
    category: '護髮',
    available: true,
    notes: '特長髮｜非會員',
  },

  // 即刻救援 DREAM 升級版
  {
    id: '31',
    name: '即刻救援 DREAM 升級版－短（會員）',
    description: '即刻救援 DREAM 升級版護髮，短髮，會員價',
    price: 3200,
    category: '護髮',
    available: true,
    notes: '短髮｜會員｜髮量多 +200',
  },
  {
    id: '32',
    name: '即刻救援 DREAM 升級版－短（非會員）',
    description: '即刻救援 DREAM 升級版護髮，短髮，非會員價',
    price: 3500,
    category: '護髮',
    available: true,
    notes: '短髮｜非會員｜髮量多 +200',
  },
  {
    id: '33',
    name: '即刻救援 DREAM 升級版－中（會員）',
    description: '即刻救援 DREAM 升級版護髮，中髮，會員價',
    price: 3800,
    category: '護髮',
    available: true,
    notes: '中髮｜會員｜髮量多 +200',
  },
  {
    id: '34',
    name: '即刻救援 DREAM 升級版－中（非會員）',
    description: '即刻救援 DREAM 升級版護髮，中髮，非會員價',
    price: 4100,
    category: '護髮',
    available: true,
    notes: '中髮｜非會員｜髮量多 +200',
  },
  {
    id: '35',
    name: '即刻救援 DREAM 升級版－中長（會員）',
    description: '即刻救援 DREAM 升級版護髮，中長髮，會員價',
    price: 4400,
    category: '護髮',
    available: true,
    notes: '中長髮｜會員｜髮量多 +200',
  },
  {
    id: '36',
    name: '即刻救援 DREAM 升級版－中長（非會員）',
    description: '即刻救援 DREAM 升級版護髮，中長髮，非會員價',
    price: 4700,
    category: '護髮',
    available: true,
    notes: '中長髮｜非會員｜髮量多 +200',
  },
  {
    id: '37',
    name: '即刻救援 DREAM 升級版－特長（會員）',
    description: '即刻救援 DREAM 升級版護髮，特長髮，會員價',
    price: 4600,
    category: '護髮',
    available: true,
    notes: '特長髮｜會員｜髮量多 +200',
  },
  {
    id: '38',
    name: '即刻救援 DREAM 升級版－特長（非會員）',
    description: '即刻救援 DREAM 升級版護髮，特長髮，非會員價',
    price: 5300,
    category: '護髮',
    available: true,
    notes: '特長髮｜非會員｜髮量多 +200',
  },
];

export function FieldsProvider({ children }: { children: React.ReactNode }) {
  const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  // 從 localStorage 載入數據
  const loadFromStorage = () => {
    try {
      const storedFields = localStorage.getItem('salon_fields');
      const storedServices = localStorage.getItem('salon_services');
      
      if (storedFields) setFields(JSON.parse(storedFields));
      if (storedServices) setServices(JSON.parse(storedServices));
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  };

  // 保存到 localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('salon_fields', JSON.stringify(fields));
      localStorage.setItem('salon_services', JSON.stringify(services));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  };

  // 初始化時載入數據
  useEffect(() => {
    loadFromStorage();
  }, []);

  // 欄位操作
  const addField = (field: Omit<Field, 'id'>) => {
    const newField: Field = {
      ...field,
      id: `field_${Date.now()}`,
    };
    const newFields = [...fields, newField];
    setFields(newFields);
    localStorage.setItem('salon_fields', JSON.stringify(newFields));
  };

  const updateField = (id: string, field: Omit<Field, 'id'>) => {
    const newFields = fields.map(f => f.id === id ? { ...f, ...field } : f);
    setFields(newFields);
    localStorage.setItem('salon_fields', JSON.stringify(newFields));
  };

  const deleteField = (id: string) => {
    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    localStorage.setItem('salon_fields', JSON.stringify(newFields));
  };

  // 服務操作
  const addService = (service: Service) => {
    const newService = {
      ...service,
      id: service.id || `service_${Date.now()}`,
    };
    const newServices = [...services, newService];
    setServices(newServices);
    localStorage.setItem('salon_services', JSON.stringify(newServices));
  };

  const updateService = (id: string, service: Service) => {
    const newServices = services.map(s => s.id === id ? { ...service, id } : s);
    setServices(newServices);
    localStorage.setItem('salon_services', JSON.stringify(newServices));
  };

  const deleteService = (id: string) => {
    const newServices = services.filter(s => s.id !== id);
    setServices(newServices);
    localStorage.setItem('salon_services', JSON.stringify(newServices));
  };

  return (
    <FieldsContext.Provider value={{
      fields,
      services,
      addField,
      updateField,
      deleteField,
      addService,
      updateService,
      deleteService,
      loadFromStorage,
      saveToStorage,
    }}>
      {children}
    </FieldsContext.Provider>
  );
}

export function useFields() {
  const context = useContext(FieldsContext);
  if (context === undefined) {
    throw new Error('useFields must be used within FieldsProvider');
  }
  return context;
}
