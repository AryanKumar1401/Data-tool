import React, {useState} from 'react';




const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const handleMonthlyClick = () => {
        if (isAnnual) {
          setIsAnnual(false);
        }
      };
    
      const handleAnnualClick = () => {
        if (!isAnnual) {
          setIsAnnual(true);
        }
      };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">       <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">Pricing plans for teams of all sizes</h1>
        <p className="text-lg text-white mt-4">
          Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
        </p>
        <div className="mt-6 inline-flex rounded-md shadow-sm">
          <button
            onClick={handleMonthlyClick}
            className={`py-2 px-4 ${!isAnnual ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} rounded-l-md border border-blue-600 hover:bg-blue-700`}
          >
            Monthly
          </button>
          <button
            onClick={handleAnnualClick}
            className={`py-2 px-4 ${isAnnual ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} rounded-r-md border border-blue-600 hover:bg-blue-700`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800">Hobby</h3>
          <p className="text-gray-600 mt-4">The essentials to provide your best work for clients.</p>
          <div className="mt-6">
            <span className="text-4xl font-extrabold text-gray-900">${isAnnual ? (15 * 12 * 0.75).toFixed(2) : 15}</span>
            <span className="text-base font-medium text-gray-600">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">5 products</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Up to 1,000 subscribers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Basic analytics</span>
            </li>
          </ul>
          <button className="mt-8 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Buy plan
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800">Freelancer</h3>
          <p className="text-gray-600 mt-4">The essentials to provide your best work for clients.</p>
          <div className="mt-6">
            <span className="text-4xl font-extrabold text-gray-900">${isAnnual ? (30 * 12 * 0.75).toFixed(2) : 30}</span>
            <span className="text-base font-medium text-gray-600">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">5 products</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Up to 1,000 subscribers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Basic analytics</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">48-hour support response time</span>
            </li>
          </ul>
          <button className="mt-8 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Buy plan
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-600">
          <h3 className="text-2xl font-semibold text-blue-600">Startup</h3>
          <p className="text-gray-600 mt-4">A plan that scales with your rapidly growing business.</p>
          <div className="mt-6">
            <span className="text-4xl font-extrabold text-gray-900">${isAnnual ? (60 * 12 * 0.75).toFixed(2) : 60}</span>
            <span className="text-base font-medium text-gray-600">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">25 products</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Up to 10,000 subscribers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Advanced analytics</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">24-hour support response time</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Marketing automations</span>
            </li>
          </ul>
          <button className="mt-8 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Buy plan
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800">Enterprise</h3>
          <p className="text-gray-600 mt-4">Dedicated support and infrastructure for your company.</p>
          <div className="mt-6">
            <span className="text-4xl font-extrabold text-gray-900">${isAnnual ? (90 * 12 * 0.75).toFixed(2) : 90}</span>
            <span className="text-base font-medium text-gray-600">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Unlimited products</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Unlimited subscribers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Advanced analytics</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">1-hour, dedicated support response time</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Marketing automations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-semibold">✓</span>
              <span className="ml-3 text-gray-600">Custom reporting tools</span>
            </li>
          </ul>
          <button className="mt-8 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Buy plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
