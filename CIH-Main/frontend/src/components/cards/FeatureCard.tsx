import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all hover:bg-gray-900/70">
      <div className="bg-blue-500/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-blue-400">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;