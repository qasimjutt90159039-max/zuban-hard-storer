import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('alzaban_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('alzaban_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('alzaban_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('alzaban_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('alzaban_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity));
    setCartItems((prev) => {
      const pId = product._id || product.id;
      const existing = prev.find((item) => (item.productId || item._id) === pId);

      if (existing) {
        showToast(`Updated quantity for "${product.name}" (${existing.quantity + qty})`, 'info');
        return prev.map((item) =>
          (item.productId || item._id) === pId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        showToast(`Added "${product.name}" to cart`, 'success');
        return [
          ...prev,
          {
            productId: pId,
            _id: pId,
            name: product.name,
            sku: product.sku || '',
            price: Number(product.price),
            image: (product.images && product.images[0]) || product.image || '',
            stock: product.stock !== undefined ? product.stock : 20,
            slug: product.slug,
            quantity: qty
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.productId || item._id) === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const removed = prev.find((item) => (item.productId || item._id) === productId);
      if (removed) {
        showToast(`Removed "${removed.name}" from cart`, 'info');
      }
      return prev.filter((item) => (item.productId || item._id) !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Lahore Delivery Rules: Free delivery above Rs. 5,000; otherwise flat Rs. 250
  const shippingFee = cartSubtotal >= 5000 || cartSubtotal === 0 ? 0 : 250;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (cartSubtotal >= (appliedCoupon.minPurchase || 0)) {
      discountAmount = Math.min(
        Math.round((cartSubtotal * appliedCoupon.discountPercentage) / 100),
        appliedCoupon.maxDiscount || 10000
      );
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        subtotal: cartSubtotal
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        showToast(res.data.message || 'Coupon applied successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        appliedCoupon,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
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
