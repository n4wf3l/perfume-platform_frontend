import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock order data
const order = {
  id: 'ORD-12345',
  date: new Date().toLocaleDateString(),
  total: 299.98,
  items: [
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
  ],
  shipping: 10.00
};

// Mock recommended products
const recommendedProducts = [
  {
    id: 2,
    name: 'Luna Dorata',
    price: 129.99,
    image: '/assets/images/product-1.jpg',
  },
  {
    id: 4,
    name: 'Velluto Nero',
    price: 159.99,
    image: '/assets/images/product-3.jpg',
  },
  {
    id: 5,
    name: 'Alba Ambrata',
    price: 134.99,
    image: '/assets/images/product-4.jpg',
  }
];

const ThankYou: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif text-amber-500 mb-4">{t('thankYou.title')}</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {t('thankYou.message')}
        </p>
      </div>
      
      {/* Order Details */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-12 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-medium text-amber-400 mb-1">{t('thankYou.orderDetails')}</h2>
            <p className="text-gray-400 text-sm">{t('thankYou.orderNumber')}: <span className="text-gray-300">{order.id}</span></p>
            <p className="text-gray-400 text-sm">{t('thankYou.orderDate')}: <span className="text-gray-300">{order.date}</span></p>
          </div>
          <Link to="/shop" className="bg-amber-600 hover:bg-amber-700 text-black font-medium px-6 py-3 rounded-md self-start transition-colors">
            {t('thankYou.continueShopping')}
          </Link>
        </div>
        
        {/* Order Items */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h3 className="text-lg font-medium text-gray-200 mb-4">{t('thankYou.orderItems')}</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="text-gray-200 font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.size} × {item.quantity}</p>
                </div>
                <div className="text-amber-400">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="border-t border-gray-800 pt-4 space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>{t('checkout.subtotal')}</span>
            <span>${(order.total - order.shipping).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>{t('checkout.shipping')}</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-gray-200 border-t border-gray-800 pt-2 mt-2">
            <span>{t('checkout.total')}</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Shipping Information */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-12 max-w-3xl mx-auto">
        <h2 className="text-xl font-medium text-amber-400 mb-4">{t('thankYou.shippingInfo')}</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-gray-300 font-medium mb-2">{t('thankYou.deliveryEstimate')}</h3>
            <p className="text-gray-400">3-5 {t('thankYou.businessDays')}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-gray-300 font-medium mb-2">{t('thankYou.trackingInfo')}</h3>
            <p className="text-gray-400">{t('thankYou.trackingEmail')}</p>
          </div>
        </div>
      </div>
      
      {/* Recommended Products */}
      <div className="pt-8 border-t border-gray-800">
        <h2 className="text-2xl font-serif text-amber-500 text-center mb-8">{t('thankYou.youMightLike')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-700/50 transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-200 group-hover:text-amber-400 transition-colors mb-2">{product.name}</h3>
                  <p className="text-amber-500">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Support Information */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-medium text-gray-200 mb-2">{t('thankYou.questions')}</h2>
        <p className="text-gray-400 mb-4">{t('thankYou.contactSupport')}</p>
        <div className="flex justify-center space-x-4">
          <Link to="/contact" className="text-amber-500 hover:text-amber-400 transition-colors">
            {t('thankYou.contactUs')}
          </Link>
          <span className="text-gray-600">|</span>
          <a href="mailto:info@sognodoro.com" className="text-amber-500 hover:text-amber-400 transition-colors">
            info@sognodoro.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;