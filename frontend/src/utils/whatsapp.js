export const STORE_WHATSAPP_NUMBER = '923351108300';
export const STORE_PHONE = '+92 42 35110830';
export const STORE_ADDRESS = 'Plot #3, Sector B-1, Block 11, Township, Lahore 54770, Pakistan';
export const STORE_EMAIL = 'info@alzaban.com';

/**
 * Generates WhatsApp inquiry URL for a specific product
 * Message: "Hello Al Zaban Hardware Store, I am interested in [PRODUCT NAME]. Please provide availability and current price."
 */
export const getProductWhatsAppUrl = (product) => {
  const text = `Hello Al Zaban Hardware Store, I am interested in ${product.name} (SKU: ${product.sku || 'N/A'}). Please provide availability and current price.`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

/**
 * Generates WhatsApp inquiry URL for cart items
 */
export const getCartWhatsAppUrl = (items, total) => {
  const itemList = items
    .map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const text = `Hello Al Zaban Hardware Store, I would like to inquire about the following items in my cart:\n\n${itemList}\n\nEstimated Subtotal: Rs. ${Number(total).toLocaleString()}\n\nPlease advise on immediate delivery to Lahore and payment instructions.`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

/**
 * Generates generic store inquiry URL
 */
export const getGeneralWhatsAppUrl = () => {
  const text = `Hello Al Zaban Hardware Store, I have an inquiry regarding hardware tools and contractor supplies at your Township, Lahore branch.`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
