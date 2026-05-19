import React from 'react';
import './FeatureCards.css';

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      icon: '✨',
      title: 'Premium Quality',
      description: 'Finest ingredients for an exceptional taste.',
    },
    {
      id: 2,
      icon: '☕',
      title: 'Handcrafted Drinks',
      description: 'Perfectly brewed to delight you.',
    },
    {
      id: 3,
      icon: '🎂',
      title: 'Exquisite Desserts',
      description: 'Beautifully crafted for every occasion.',
    },
    {
      id: 4,
      icon: '💜',
      title: 'Made with Love',
      description: 'Passion and care in every creation.',
    },
  ];

  return (
    <section className="feature-section">
      <div className="features-container">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              {/* Glow Background */}
              <div className="feature-glow"></div>

              {/* Card Content */}
              <div className="feature-content">
                {/* Icon */}
                <div className="feature-icon">
                  <div className="icon-glow"></div>
                  <span className="icon-emoji">{feature.icon}</span>
                </div>

                {/* Title */}
                <h3 className="feature-title">{feature.title}</h3>

                {/* Description */}
                <p className="feature-description">{feature.description}</p>
              </div>

              {/* Border Glow */}
              <div className="card-border-glow"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="features-divider"></div>
    </section>
  );
};

export default FeatureCards;
