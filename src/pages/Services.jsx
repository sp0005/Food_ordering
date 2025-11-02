import { FiTruck, FiPackage, FiUsers } from 'react-icons/fi';

const Services = () => {
  const services = [
    { icon: FiTruck, title: 'Fast Delivery', description: 'Fast Delivery within 30 minutes.' },
    { icon: FiPackage, title: 'Takeaway', description: 'Takeaway available within 15 minutes.' },
    { icon: FiUsers, title: 'Catering', description: 'Catering for events with 24-hour notice.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <Icon className="text-4xl text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;