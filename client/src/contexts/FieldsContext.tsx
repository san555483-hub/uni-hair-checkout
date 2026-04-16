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
  { id: '1', name: '剪髮', description: '專業剪髮服務', price: 500, category: '基礎服務', available: true, notes: '' },
  { id: '2', name: '燙髮', description: '各式燙髮造型', price: 1200, category: '造型服務', available: true, notes: '' },
  { id: '3', name: '染髮', description: '專業染髮服務', price: 1500, category: '造型服務', available: true, notes: '' },
  { id: '4', name: '護髮', description: '深層護理療程', price: 800, category: '護理服務', available: true, notes: '' },
  { id: '5', name: '頭皮護理', description: '頭皮清潔護理', price: 600, category: '護理服務', available: true, notes: '' },
  { id: '6', name: '造型設計', description: '專業造型設計', price: 900, category: '基礎服務', available: true, notes: '' },
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
