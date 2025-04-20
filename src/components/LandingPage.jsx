// LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    navigate('/login');
  };

  return (
    <div className={styles['landing-container']}>
      <header className={styles['header']}>
        <h1 className={styles['logo']}>SereneApex</h1>
        <nav className={styles['nav-links']}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation(); }}>Log in</a>
          <button className={styles['signup-btn']} onClick={handleNavigation}>Sign up</button>
        </nav>
      </header>

      <main className={styles['main-content']}>
        <h2 className={styles['tagline']}>Unleash your Potential</h2>

        <div className={styles['cta-box']}>
          <div className={styles['todo-options']}>
            <h3>Beyond the List: Transform Your Intentions into Accomplishments.</h3>
            <p className={styles['feature-description']}>
              Stay organized, boost productivity, and achieve your goals with our 
              intuitive task management solution.
            </p>
            <button className={styles['get-started']} onClick={handleNavigation}>Get Started</button>
          </div>

          <div className={styles['icons']}>
            <div className={`${styles['icon-container']} ${styles['feature-card']}`}>
              <div className={styles['icon-circle']}>
                <img src="/assets/check.png" alt="check" />
              </div>
              <div className={styles['feature-text']}>
                <h4>Stay On Track</h4>
                <p>Organize tasks and never miss deadlines</p>
              </div>
            </div>
            <div className={styles['icons-base']}>
              <div className={`${styles['icon-container']} ${styles['feature-card']}`}>
                <div className={styles['icon-circle']}>
                  <img src="/assets/brush.png" alt="brush" />
                </div>
                <div className={styles['feature-text']}>
                  <h4>Time-block Your Work</h4>
                  <p>Manage time efficiently</p>
                </div>
              </div>
              <div className={`${styles['icon-container']} ${styles['feature-card']}`}>
                <div className={styles['icon-circle']}>
                  <img src="/assets/pencil.png" alt="pencil" />
                </div>
                <div className={styles['feature-text']}>
                  <h4>Get Things Done</h4>
                  <p>Achieve your goals with ease</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles['footer-links']}>© 2023 SereneApex</footer>
      </main>
    </div>
  );
}
