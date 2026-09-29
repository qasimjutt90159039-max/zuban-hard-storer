import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('alzaban_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('alzaban_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some((item) => (item._id || item.productId) === productId);
  };

  const toggleWishlist = (product) => {
    const pId = product._id || product.productId;
    setWishlist((prev) => {
      const exists = prev.some((item) => (item._id || item.productId) === pId);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((item) => (item._id || item.productId) !== pId);
      } else {
        showToast(`Added "${product.name}" to wishlist`, 'success');
        return [
          ...prev,
          {
            _id: pId,
            productId: pId,
            name: product.name,
            sku: product.sku || '',
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice,
            discount: product.discount,
            image: (product.images && product.images[0]) || product.image || '',
            category: product.category,
            brand: product.brand,
            rating: product.rating,
            stockStatus: product.stockStatus || 'In Stock',
            slug: product.slug
          }
        ];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => (item._id || item.productId) !== productId));
    showToast('Item removed from wishlist', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
