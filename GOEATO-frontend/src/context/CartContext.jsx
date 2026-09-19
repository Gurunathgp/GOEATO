import React, { createContext, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/index.js';
import { STORAGE_KEYS } from '../config/constants.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.CART, []); // [{_id,name,price,img,qty}]
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  const updateItems = (updater) => {
    setItems(updater);
  };

  const add = (item, qty = 1) => {
    const id = item._id || item.id;
    updateItems((prev) => {
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

  const remove = (id) => updateItems((prev) => prev.filter((p) => (p._id || p.id) !== id));
  const setQty = (id, qty) => {
    qty = Math.min(99, Math.floor(Number(qty)));
    if (qty <= 0) return remove(id);
    updateItems((prev) => prev.map((p) => ((p._id || p.id) === id ? { ...p, qty } : p)));
  };
  const clear = () => updateItems(() => []);

  // Optimistic update functions
  const optimisticAdd = (item, qty = 1) => {
    const id = item._id || item.id;
    const previousItems = [...items];

    // Optimistically update
    add(item, qty);

    // Store previous state for rollback
    setOptimisticUpdates(prev => ({
      ...prev,
      [id]: previousItems
    }));

    return () => {
      // Rollback function
      updateItems(() => previousItems);
      setOptimisticUpdates(prev => {
        const updates = { ...prev };
        delete updates[id];
        return updates;
      });
    };
  };

  const optimisticRemove = (id) => {
    const previousItems = [...items];

    // Optimistically update
    remove(id);

    // Store previous state for rollback
    setOptimisticUpdates(prev => ({
      ...prev,
      [id]: previousItems
    }));

    return () => {
      // Rollback function
      updateItems(() => previousItems);
      setOptimisticUpdates(prev => {
        const updates = { ...prev };
        delete updates[id];
        return updates;
      });
    };
  };

  const optimisticSetQty = (id, qty) => {
    const previousItems = [...items];

    // Optimistically update
    setQty(id, qty);

    // Store previous state for rollback
    setOptimisticUpdates(prev => ({
      ...prev,
      [id]: previousItems
    }));

    return () => {
      // Rollback function
      updateItems(() => previousItems);
      setOptimisticUpdates(prev => {
        const updates = { ...prev };
        delete updates[id];
        return updates;
      });
    };
  };

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return { items, add, remove, setQty, clear, count, total, optimisticAdd, optimisticRemove, optimisticSetQty };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
