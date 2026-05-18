import React from 'react';
import Menu from './Menu';

const Home = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .home-hero {
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%);
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 60px 36px;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 800px 600px at 50% 0%, rgba(0,212,255,0.2), transparent 70%),
            radial-gradient(ellipse 600px 600px at -10% 50%, rgba(16,185,129,0.15), transparent 60%),
            radial-gradient(ellipse 600px 600px at 110% 50%, rgba(0,212,255,0.15), transparent 60%);
          filter: blur(1px);
          animation: heroGlow 8s ease-in-out infinite;
        }}

        @keyframes heroGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 700px;
        }

        .hero-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          font-weight: 700;
          margin: 0 0 16px;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.85);
          margin: 0;
          line-height: 1.6;
        }
      `}</style>

      <div className="home-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1>IvoryMist</h1>
          <p className="hero-subtitle">Artisan Coffee Crafted With Passion. Order Now, Savor Later.</p>
        </div>
      </div>
      
      <Menu />
    </>
  );
};

export default Home;
