import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .about-container {
          min-height: calc(100vh - 72px);
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%);
          padding: 60px 36px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.92);
        }

        .about-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }

        .about-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 80px;
          background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #2e1065 100%);
          padding: 48px 40px;
          border-radius: 20px;
          box-shadow: 
            0 12px 40px rgba(0,0,0,0.4),
            0 0 60px rgba(79,70,229,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(79,70,229,0.3);
          position: relative;
          overflow: hidden;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 400px 300px at 20% 30%, rgba(139,92,246,0.15), transparent 60%),
            radial-gradient(ellipse 350px 250px at 80% 70%, rgba(99,102,241,0.12), transparent 55%);
          pointer-events: none;
          z-index: 0;
        }

        .about-hero > * {
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          font-weight: 700;
          margin: 0 0 24px;
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.3));
        }

        .hero-subtitle {
          color: rgba(255,255,255,0.85);
          font-size: 16px;
          line-height: 1.8;
          margin: 0 0 32px;
          max-width: 500px;
        }

        .hero-visual {
          perspective: 1000px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at center, rgba(232,201,122,0.08) 0%, transparent 70%);
          border-radius: 24px;
          border: 1px solid rgba(232,201,122,0.15);
          overflow: hidden;
          position: relative;
        }

        .hero-visual::before {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, rgba(232,201,122,0.2), rgba(240,216,142,0.1));
          border-radius: 50%;
          filter: blur(60px);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        .hero-text-badge {
          position: relative;
          z-index: 1;
          text-align: center;
          font-size: 18px;
          color: #e8c97a;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
        }

        .cta-button-container {
          display: flex;
          gap: 16px;
        }

        .btn-browse {
          padding: 14px 32px;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 24px rgba(0,212,255,0.35);
        }

        .btn-browse:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 36px rgba(0,212,255,0.5);
        }

        .team-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 48px;
          text-align: center;
        }

        .profiles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 32px;
        }

        .card {
          background: linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(16,185,129,0.03) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,212,255,0.25);
          padding: 32px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(0,212,255,0.2), transparent);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(0,212,255,0.5);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.25);
          background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(16,185,129,0.08) 100%);
        }

        .card:hover::before {
          opacity: 1;
          animation: pulse 0.6s ease-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .profile-header {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 16px;
          object-fit: cover;
          border: 2px solid rgba(0,212,255,0.4);
          box-shadow: 0 8px 24px rgba(0,212,255,0.3);
          flex-shrink: 0;
          transition: transform 0.4s;
        }

        .card:hover .avatar {
          transform: scale(1.05) rotateZ(1deg);
        }

        .meta h3 {
          margin: 0 0 8px;
          color: #00d4ff;
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
        }

        .meta-role {
          color: #10b981;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
          font-weight: 600;
        }

        .meta-description {
          margin: 0;
          color: rgba(255,255,255,0.75);
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
        }

        .info-section {
          margin-top: 80px;
          padding: 48px 40px;
          background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(16,185,129,0.05) 100%);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .info-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 24px;
        }

        .info-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          margin-bottom: 32px;
        }

        .info-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-block h3 {
          color: #00d4ff;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }

        .info-block p {
          margin: 0;
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          line-height: 1.8;
        }

        .story-section {
          margin-top: 80px;
          padding: 48px 40px;
          background: linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(99,102,241,0.05) 100%);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .story-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 24px;
        }

        .story-text {
          color: rgba(255,255,255,0.85);
          font-size: 16px;
          line-height: 2;
          max-width: 900px;
          margin: 0 0 20px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .value-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 24px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          border-color: rgba(0,212,255,0.4);
          background: rgba(255,255,255,0.08);
          transform: translateY(-4px);
        }

        .value-card h4 {
          color: #10b981;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .value-card p {
          margin: 0;
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          line-height: 1.7;
        }

        .highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .highlight-item {
          text-align: center;
          padding: 24px;
          background: rgba(0,212,255,0.05);
          border-radius: 12px;
          border: 1px solid rgba(0,212,255,0.15);
        }

        .highlight-number {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .highlight-text {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          margin: 8px 0 0;
        }

        @media (max-width: 1024px) {
          .about-hero {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 60px;
          }

          .hero-content h1 {
            font-size: 40px;
          }

          .hero-visual {
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .about-container {
            padding: 40px 24px;
          }

          .about-hero {
            margin-bottom: 40px;
          }

          .hero-content h1 {
            font-size: 32px;
          }

          .profiles {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .card {
            padding: 24px;
          }

          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .meta-description {
            margin-bottom: 0;
          }

          .info-section,
          .story-section {
            padding: 32px 24px;
            margin-top: 60px;
          }

          .info-section h2,
          .story-section h2 {
            font-size: 28px;
          }

          .info-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .values-grid,
          .highlights {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .story-text {
            font-size: 15px;
            line-height: 1.8;
          }
        }
      `}</style>

      <div className="about-container">
        <div className="about-wrapper">
          <div className="about-hero">
            <div className="hero-content">
              <h1>About IvoryMist</h1>
              <p className="hero-subtitle">
                Where elegance meets convenience. IvoryMist transforms your café experience into an art form, blending premium craftsmanship with seamless digital innovation. Every order tells a story of refined taste and effortless luxury.
              </p>
            </div>
            <div className="hero-visual">
              <div className="hero-text-badge">Elegance in Every Moment</div>
            </div>
          </div>

          <div className="team-section">
            <h2>Meet the Team</h2>
            <div className="profiles">
              <div className="card">
                <div className="profile-header">
                  <img src="/images/carlo.jpg" alt="Mark Carlo D. Salaum" className="avatar" />
                  <div className="meta">
                    <h3>Mark Carlo</h3>
                    <p className="meta-role">Full Stack Developer & Designer</p>
                  </div>
                </div>
                <p className="meta-description">
                  Visionary developer and designer crafting seamless digital experiences from concept to execution. Specializes in creating intuitive ordering systems that blend technology with elegant design, ensuring every interaction feels effortless and memorable.
                </p>
              </div>

              <div className="card">
                <div className="profile-header">
                  <img src="/images/charlene_m.jpg" alt="Charlene B. Monisit" className="avatar" />
                  <div className="meta">
                    <h3>Charlene</h3>
                    <p className="meta-role">Design & Frontend</p>
                  </div>
                </div>
                <p className="meta-description">
                  Design perfectionist devoted to crafting beautiful, accessible interfaces. Creates polished visual experiences that balance aesthetics with usability, making luxury feel approachable and timeless.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="story-section">
            <h2>Our Story</h2>
            <p className="story-text">
              IvoryMist was born from a simple vision: to elevate the everyday café experience into something truly extraordinary. Founded with a passion for artisanal coffee and premium service, we believe that every customer deserves an elegant, seamless journey from discovery to delivery. Our commitment to excellence permeates every aspect—from the carefully curated menu to our innovative ordering system that puts your preferences first.
            </p>
            <p className="story-text">
              We're more than just a café; we're a lifestyle choice for those who appreciate the finer things in life delivered with uncompromising quality and modern convenience.
            </p>

            <h3 style={{color: '#00d4ff', marginTop: '40px', marginBottom: '24px', fontSize: '24px', fontFamily: "'Playfair Display', serif"}}>Our Values</h3>
            <div className="values-grid">
              <div className="value-card">
                <h4>🎨 Elegance</h4>
                <p>Every detail matters. From our curated products to our refined interface, elegance defines the IvoryMist experience.</p>
              </div>
              <div className="value-card">
                <h4>⚡ Innovation</h4>
                <p>We continuously evolve. Cutting-edge technology meets traditional craftsmanship to create something truly exceptional.</p>
              </div>
              <div className="value-card">
                <h4>❤️ Quality</h4>
                <p>Premium ingredients, expert preparation, and meticulous attention to every order ensure you always get the best.</p>
              </div>
              <div className="value-card">
                <h4>🤝 Customer Focus</h4>
                <p>Your satisfaction drives everything we do. We listen, adapt, and continuously improve based on your feedback.</p>
              </div>
            </div>

            <h3 style={{color: '#00d4ff', marginTop: '40px', marginBottom: '24px', fontSize: '24px', fontFamily: "'Playfair Display', serif"}}>Why Choose IvoryMist</h3>
            <div className="highlights">
              <div className="highlight-item">
                <p className="highlight-number">100%</p>
                <p className="highlight-text">Premium Quality Products</p>
              </div>
              <div className="highlight-item">
                <p className="highlight-number">24/7</p>
                <p className="highlight-text">Online Ordering Available</p>
              </div>
              <div className="highlight-item">
                <p className="highlight-number">30min</p>
                <p className="highlight-text">Fast Delivery Promise</p>
              </div>
              <div className="highlight-item">
                <p className="highlight-number">10k+</p>
                <p className="highlight-text">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="info-section">
            <h2>Get in Touch</h2>
            <div className="info-content">
              <div className="info-block">
                <h3>📍 Location</h3>
                <p>IvoryMist Café<br />123 Elegance Street<br />Premium Plaza, City Center<br />Postal Code 1234</p>
              </div>
              <div className="info-block">
                <h3>📞 Contact</h3>
                <p>Phone: +63 (555) 123-4567<br />Email: hello@ivorymist.com<br />Support: support@ivorymist.com</p>
              </div>
              <div className="info-block">
                <h3>🕐 Hours of Operation</h3>
                <p>Monday - Friday: 7:00 AM - 10:00 PM<br />Saturday: 8:00 AM - 11:00 PM<br />Sunday: 8:00 AM - 9:00 PM<br />Holidays: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
