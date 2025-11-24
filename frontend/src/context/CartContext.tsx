import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem } from '../data/mockData';
import { getCart, addOrUpdateCart, removeCartItem, mergeGuestCart } from '../services/api';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  fetchCartFromBackend: () => Promise<void>;
  addOrUpdateCartBackend: (productId: string, quantity: number) => Promise<void>;
  removeCartItemBackend: (productId: string) => Promise<void>;
} | null>(null);

const CART_STORAGE_KEY = 'ayur_cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount
        };
      } else {
        const newItems = [...state.items, action.payload];
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items: newItems,
          total: newTotal,
          itemCount: newItemCount
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Fetch cart from backend and update context
  const fetchCartFromBackend = async () => {
    try {
      const res = await getCart();
      const items = (res.data.items || []).map((item: any) => ({
        id: item.productId._id || item.productId,
        name: item.productId.name,
        price: item.productId.price,
        image: Array.isArray(item.productId.images) ? item.productId.images[0] : item.productId.image,
        quantity: item.quantity
      }));
      dispatch({ type: 'CLEAR_CART' });
      items.forEach((item: any) => dispatch({ type: 'ADD_ITEM', payload: item }));
    } catch (err) {
      // If backend fails, try to load from localStorage
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          if (parsed && Array.isArray(parsed.items)) {
            dispatch({ type: 'CLEAR_CART' });
            parsed.items.forEach((item: any) => dispatch({ type: 'ADD_ITEM', payload: item }));
          }
        } catch {}
      }
    }
  };

  // Add or update cart item in backend and update context
  const addOrUpdateCartBackend = async (productId: string, quantity: number) => {
    try {
      await addOrUpdateCart({ productId, quantity });
      await fetchCartFromBackend();
    } catch (err) {
      // ignore
    }
  };

  // Remove cart item in backend and update context
  const removeCartItemBackend = async (productId: string) => {
    try {
      await removeCartItem(productId);
      await fetchCartFromBackend();
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    // Behavior:
    // - If no user: load guest cart from localStorage
    // - If user is admin: keep cart empty and do not call cart APIs
    // - If regular user: if there is a guest cart in localStorage, merge it to server then fetch server cart
    const initialize = async () => {
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!user) {
        // load guest cart
        if (localCart) {
          try {
            const parsed = JSON.parse(localCart);
            if (parsed && Array.isArray(parsed.items)) {
              dispatch({ type: 'CLEAR_CART' });
              parsed.items.forEach((item: any) => dispatch({ type: 'ADD_ITEM', payload: item }));
            }
          } catch {}
        }
        return;
      }

      // user exists
      if (user.role === 'admin') {
        // Admin should not have a cart
        dispatch({ type: 'CLEAR_CART' });
        return;
      }

      // Regular logged-in user: if guest cart exists, merge then fetch
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
            // transform to server shape: { items: [{ productId, quantity }] }
            const payload = {
              items: parsed.items.map((it: any) => ({ productId: it.id, quantity: it.quantity }))
            } as any;
            try {
              await mergeGuestCart(payload);
              // clear local guest cart after successful merge
              localStorage.removeItem(CART_STORAGE_KEY);
            } catch {}
          }
        } catch {}
      }

      await fetchCartFromBackend();
    };

    initialize();
  }, [user]);

  return (
    <CartContext.Provider value={{ state, dispatch, fetchCartFromBackend, addOrUpdateCartBackend, removeCartItemBackend }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};