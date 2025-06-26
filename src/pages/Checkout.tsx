import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock cart data for summary
const cartItems = [
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

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10;
  const total = subtotal + shipping;
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit-card'
  });
  
  // Payment steps
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
      return;
    }
    
    // Process payment
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/thank-you');
    }, 2000);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif text-amber-500 mb-6">{t('checkout.title')}</h1>
      
      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-amber-600 text-black' : 'bg-gray-700 text-gray-400'}`}>1</div>
          <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-amber-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-amber-600 text-black' : 'bg-gray-700 text-gray-400'}`}>2</div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-400">{t('checkout.shippingInfo')}</span>
          <span className="text-sm text-gray-400">{t('checkout.payment')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-medium text-amber-400 mb-4">{t('checkout.shippingInfo')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="firstName">
                      {t('checkout.firstName')}*
                    </label>
                    <input
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="lastName">
                      {t('checkout.lastName')}*
                    </label>
                    <input
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                      {t('checkout.email')}*
                    </label>
                    <input
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="phone">
                      {t('checkout.phone')}
                    </label>
                    <input
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm mb-2" htmlFor="address">
                    {t('checkout.address')}*
                  </label>
                  <input
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="city">
                      {t('checkout.city')}*
                    </label>
                    <input
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="postalCode">
                      {t('checkout.postalCode')}*
                    </label>
                    <input
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="country">
                      {t('checkout.country')}*
                    </label>
                    <select
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t('checkout.selectCountry')}</option>
                      <option value="BE">Belgium</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="NL">Netherlands</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-medium text-amber-400 mb-4">{t('checkout.payment')}</h2>
                
                <div className="mb-6">
                  <p className="text-gray-300 mb-4">{t('checkout.paymentMethod')}</p>
                  
                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-md bg-gray-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-amber-500"
                      />
                      <div className="flex items-center">
                        <span className="ml-2">Credit Card</span>
                        <div className="flex space-x-2 ml-4">
                          {/* Credit card icons would go here */}
                          <div className="w-8 h-5 bg-blue-700 rounded"></div>
                          <div className="w-8 h-5 bg-red-600 rounded"></div>
                          <div className="w-8 h-5 bg-green-600 rounded"></div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-md bg-gray-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-amber-500"
                      />
                      <span className="ml-2">PayPal</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-md bg-gray-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank-transfer"
                        checked={formData.paymentMethod === 'bank-transfer'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-amber-500"
                      />
                      <span className="ml-2">{t('checkout.bankTransfer')}</span>
                    </label>
                  </div>
                </div>
                
                {/* Credit card form would go here if needed */}
                {formData.paymentMethod === 'credit-card' && (
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        {t('checkout.cardNumber')}
                      </label>
                      <input
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          {t('checkout.expiryDate')}
                        </label>
                        <input
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          type="text"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          CVV
                        </label>
                        <input
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          type="text"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* PayPal instructions */}
                {formData.paymentMethod === 'paypal' && (
                  <div className="bg-gray-800 p-4 rounded-md mb-6">
                    <p className="text-gray-300 text-sm">
                      {t('checkout.paypalInstructions')}
                    </p>
                  </div>
                )}
                
                {/* Bank transfer instructions */}
                {formData.paymentMethod === 'bank-transfer' && (
                  <div className="bg-gray-800 p-4 rounded-md mb-6">
                    <p className="text-gray-300 text-sm mb-4">
                      {t('checkout.bankTransferInstructions')}
                    </p>
                    <div className="text-gray-300 text-sm">
                      <p><strong>IBAN:</strong> BE00 0000 0000 0000</p>
                      <p><strong>BIC:</strong> GEBABEBB</p>
                      <p><strong>Bank:</strong> Example Bank</p>
                      <p><strong>{t('checkout.reference')}:</strong> ORDER-{Math.floor(Math.random() * 1000000)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                >
                  {t('checkout.back')}
                </button>
              )}
              
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-8 py-3 bg-amber-600 hover:bg-amber-700 text-black font-medium rounded-md transition-colors ml-auto flex items-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {currentStep === 1 
                  ? t('checkout.continue')
                  : isProcessing
                    ? t('checkout.processing')
                    : t('checkout.placeOrder')
                }
              </button>
            </div>
          </form>
        </div>
        
        {/* Order summary section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-8">
            <h2 className="text-xl font-medium text-amber-400 mb-4">{t('checkout.orderSummary')}</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-200 font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.size} × {item.quantity}</p>
                  </div>
                  <div className="text-amber-400">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>{t('checkout.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t('checkout.shipping')}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-200 border-t border-gray-800 pt-2 mt-2">
                <span>{t('checkout.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;