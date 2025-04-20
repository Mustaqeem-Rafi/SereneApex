// LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    {
      icon: '/assets/check.png',
      title: 'Smart Task Management',
      text: 'Organize tasks with intelligent prioritization and never miss deadlines again'
    },
    {
      icon: '/assets/clock.png',
      title: 'Time Blocking',
      text: 'Visualize your day with time slots to maximize productivity and focus'
    },
    {
      icon: '/assets/search.png',
      title: 'Progress Tracking',
      text: 'Monitor your productivity trends with beautiful and insightful analytics'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles['Login-container']}>
      <header className={styles['header']}>
        <h1 
          className={styles['logo']} 
          onClick={handleBackToHome} 
          style={{ cursor: 'pointer' }}
        >
          SereneApex
        </h1>
      </header>

      <main className={styles['main-content']}>
        <h2 className={styles['tagline']}>Welcome Back</h2>

        <div className={styles['Login-cta-box']}>
          <div className={styles['todo-options']}>
            <form className={styles['login-form']} onSubmit={handleSubmit}>
              <div className={styles['form-group']}>
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email"
                  className={styles['form-input']}
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  autoFocus
                />
              </div>
              
              <div className={styles['form-group']}>
                <label htmlFor="password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Enter your password"
                    className={styles['form-input']}
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                  />
                  <button
                    type="button"
                    className={styles['password-toggle']}
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className={styles['utility-row']}>
                <label className={styles['checkbox-group']}>
                  <input 
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(prev => !prev)}
                  />
                  <span className={styles['checkbox-label']}>Remember me</span>
                </label>
                <button type="button" className={styles['text-link']}>
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                className={styles['get-started']}
                onClick={() => navigate('/home')}
              >
                Sign In
              </button>

              <p className={styles['signup-link']}>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className={styles['text-link']}
                  onClick={() => navigate('/signup')}
                >
                  Create account
                </button>
              </p>
            </form>
          </div>

          <div className={styles['icons']}>
            {features.map((feature, index) => {
              const cardClass = `
                ${styles['icon-container']} 
                ${styles['feature-card']} 
                ${index === activeFeature ? styles['active'] : ''}
                ${index === (activeFeature - 1 + features.length) % features.length ? styles['prev'] : ''}
                ${index === (activeFeature + 1) % features.length ? styles['next'] : ''}
              `.trim();

              return (
                <div 
                  key={index}
                  className={cardClass}
                  style={{ 
                    position: 'absolute',
                    zIndex: index === activeFeature ? 3 : 2
                  }}
                >
                  <div className={styles['icon-circle']}>
                    <img src={feature.icon} alt={feature.title} />
                  </div>
                  <div className={styles['feature-text']}>
                    <h4>{feature.title}</h4>
                    <p>{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className={styles['footer-links']}>© 2023 SereneApex</footer>
      </main>
    </div>
  );
};

export default LoginPage;
