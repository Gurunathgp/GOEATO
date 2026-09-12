import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'goeato_cart';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load); // [{_id,name,price,img,qty}]

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (item, qty = 1) => {
    const id = item._id || item.id;
    setItems((prev) => {
      const found = prev.find((p) => (p._id || p.id) === id);
      if (found) return prev.map((p) => ((p._id || p.id) === id ? { ...p, qty: Math.min(99, p.qty + qty) } : p));
      return [...prev, {
        _id: id,
        name: item.name,
        price: item.price,
        img: item.img,
        restaurantId: item.restaurantId,
        qty,
      }];
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
  const setQty = (id, qty) => {
    qty = Math.min(99, Math.floor(Number(qty)));
    if (qty <= 0) return remove(id);
    setItems((prev) => prev.map((p) => ((p._id || p.id) === id ? { ...p, qty } : p)));
  };
  const clear = () => setItems([]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return { items, add, remove, setQty, clear, count, total };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
