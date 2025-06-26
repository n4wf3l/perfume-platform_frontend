import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: 'Sogno Intenso',
    price: 149.99,
    image: '/assets/images/featured-1.jpg',
    quantity: 1,
    size: '100ml'
  },
  {
    id: 3,
    name: 'Notte Stellata',
    price: 139.99,
    image: '/assets/images/product-2.jpg',
    quantity: 1,
    size: '50ml'
  }
];

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const discount = promoSuccess ? subtotal * 0.1 : 0; // 10% discount if promo applied
  const total = subtotal + shipping - discount;
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handlePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoSuccess('10% discount applied');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoSuccess('');
    }
  };
  
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-amber-500 text-center mb-12">{t('cart.title')}</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-serif text-amber-400 mb-4">{t('cart.empty')}</h2>
            <p className="text-gray-300 mb-6">{t('cart.emptyMessage')}</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-medium rounded-md transition-colors duration-300"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-8/12">
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-gray-400 text-left">
                      <th className="px-4 py-3">{t('cart.product')}</th>
                      <th className="px-4 py-3">{t('cart.price')}</th>
                      <th className="px-4 py-3">{t('cart.quantity')}</th>
                      <th className="px-4 py-3">{t('cart.total')}</th>
                      <th className="px-4 py-3 sr-only">{t('cart.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {cartItems.map(item => (
                      <tr key={item.id} className="text-gray-300">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <img 
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-amber-400">{item.name}</h3>
                              <p className="text-sm text-gray-400">{item.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center border border-gray-700 rounded-md max-w-[100px]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-400 hover:text-amber-500 focus:outline-none"
                            >
                              -
                            </button>
                            <span className="px-2 py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-400 hover:text-amber-500 focus:outline-none"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-amber-500 focus:outline-none"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between">
                <Link
                  to="/shop"
                  className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('cart.continueShopping')}
                </Link>
                
                <button
                  onClick={() => setCartItems([])}
                  className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('cart.clearCart')}
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-4/12">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-serif text-amber-400 mb-4">{t('cart.orderSummary')}</h2>
                
                <div className="mb-6">
                  <form onSubmit={handlePromoCode}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('cart.promoCode')}</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-l-md px-4 py-2 flex-grow text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder={t('cart.enterPromoCode')}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-800 border border-gray-700 border-l-0 rounded-r-md text-amber-500 hover:bg-gray-700"
                      >
                        {t('cart.apply')}
                      </button>
                    </div>
                    {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
                    {promoSuccess && <p className="text-green-500 text-sm mt-2">{promoSuccess}</p>}
                  </form>
                </div>
                
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>{t('cart.discount')}</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-800 pt-3 flex justify-between font-medium text-lg">
                    <span>{t('cart.total')}</span>
                    <span className="text-amber-400">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-6 w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-medium rounded-md transition-colors duration-300"
                >
                  {t('cart.proceedToCheckout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;