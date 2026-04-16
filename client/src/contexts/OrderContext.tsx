import React, { createContext, useContext, useState } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: Date;
}

interface OrderContextType {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  createOrder: (items: OrderItem[], paymentMethod: string) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = (items: OrderItem[], paymentMethod: string): Order => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Order = {
      id: `ORD${Date.now()}`,
      items,
      totalAmount,
      paymentMethod,
      createdAt: new Date(),
    };
    setCurrentOrder(order);
    return order;
  };

  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}
