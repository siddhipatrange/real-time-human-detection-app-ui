// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Import AuthContext
import '../App.css';
import { toast } from 'react-toastify'; // ✅ Add this

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Access user login status

  // ✅ Button logic
  const handleStartMonitoring = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      toast.warning('Please sign in to start monitoring.');
      navigate('/signin');
    }
  };

  return (
    <>
      <header className="section" id="home">
        <div className="container text-center">
          <h1 className="display-5 fw-bold">Real-Time Human Detection</h1>
          <p className="lead">Monitor prohibited areas with intelligent surveillance</p>
          <button className="get-started-button mt-3" onClick={handleStartMonitoring}>
            Start Monitoring
          </button>
        </div>
      </header>

      <section className="about-section" id="about">
  <div className="container text-center">
    <h2 className="section-title mb-5" data-aos="fade-up">Functionality</h2>
    <div className="row align-items-center">
      {/* Left Text */}
      <div className="col-md-5 mb-4 mb-md-0" data-aos="fade-right">
        <ul className="feature-list">
          <li><i className="fas fa-user-check animated-icon"></i> Detects human presence, even if partially visible.</li>
          <li><i className="fas fa-user-secret animated-icon"></i> Flags suspicious vs normal behavior.</li>
          <li><i className="fas fa-exclamation-triangle animated-icon"></i> Area-specific alerts: prohibited vs strictly prohibited.</li>
          <li><i className="fas fa-bell animated-icon"></i> Triggers intelligent alarm systems.</li>
          <li><i className="fas fa-brain animated-icon"></i> Trained on vast, diverse datasets.</li>
          <li><i className="fas fa-lightbulb animated-icon"></i> Works in all lighting & camera conditions.</li>
        </ul>
      </div>

      {/* Right Video/Image */}
      <div className="col-md-7 text-center" data-aos="fade-left">
        <div className="video-wrapper">
          <video width="100%" height="auto" controls className="video-animated">
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </div>
</section>


      <section className="section" id="features" >
        <div className="container text-center">
          <h2 className="section-title mb-5" data-aos="fade-up">Key Features</h2>
          <div className="row">
            {/* Prohibited Area */}
            <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="100">
              <div className="feature-card shadow-sm p-4 h-100">
                <div className="feature-icon mb-3 text-danger">
                  <i className="fa-solid fa-shield-halved fa-2x"></i>
                </div>
                <h5 className="text-danger">Prohibited Area</h5>
                <p>Detects suspicious activity and triggers an alarm accordingly.</p>
                <ul className="text-start mt-3" style={{fontSize: '15px'}}>
                  <li> Detects humans in sensitive zones.</li>
                  <li> AI checks for unauthorized movements.</li>
                  <li> Alarm triggers only if suspicious activity is detected.</li>
                  <li> Ideal for labs, data centers, or restricted office zones.</li>
                </ul>
              </div>
            </div>

            {/* Strictly Prohibited */}
            <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="feature-card shadow-sm p-4 h-100">
                <div className="feature-icon mb-3 text-warning">
                  <i className="fa-solid fa-lock fa-2x"></i>
                </div>
                <h5 className="text-warning">Strictly Prohibited Area</h5>
                <p>Triggers an alarm instantly upon any human detection.</p>
                <ul className="text-start mt-3" style={{fontSize: '15px'}}>
                  <li> Alerts instantly on any human detection.</li>
                  <li> Meant for high-security zones: server rooms, safes, military stores.</li>
                  <li> No tolerance for presence — triggers alarm even if idle.</li>
                  <li> Can auto-log incident time for reports.</li>
                </ul>
              </div>
            </div>

            {/* Video Monitoring */}
            <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="feature-card shadow-sm p-4 h-100">
                <div className="feature-icon mb-3" style={{ color: '#e67e22' }}>
                  <i className="fa-solid fa-video fa-2x"></i>
                </div>
                <h5 style={{ color: '#e67e22' }}>Video Monitoring</h5>
                <p>Upload and analyze real-time footage using neural networks.</p>
                <ul className="text-start mt-3" style={{fontSize: '15px'}}>
                  <li> Upload videos for real-time analysis.</li>
                  <li> Leverages deep learning models trained on surveillance footage.</li>
                  <li> Analyzes posture, motion, and area boundaries.</li>
                  <li> Stores detection metadata for future logs.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="publication" className="py-5 publication-section">
        <div className="container">
          <h2 className="text-center mb-4" data-aos="fade-up">Publication</h2>
          <div className="row align-items-center">
            
            {/* Left: Details */}
            <div className="col-md-6 mb-4 mb-md-0" data-aos="fade-right">
              <p>
              Our recent research paper, titled <strong>'Real-time Human Detection and Activity Recognition in Restricted Areas Using Neural Network'</strong>, presents an advanced surveillance system designed to detect human presence and recognize activities in environments with varying access control. The paper outlines the use of YOLOv5 for precise human detection and a combination of CNN and LSTM networks for behavior analysis. It also details the training process on the UCF50 dataset, enabling the system to identify a wide range of activities. This work aims to enhance security through real-time monitoring, automated threat detection, and activity recognition, offering a scalable alternative to traditional surveillance systems.
              </p>
              <ul>
                <li><strong>Title:</strong> Real-time Human Detection in Prohibited Areas using Neural Network </li>
                <li><strong>Conference:</strong> International Conference on Advances in Computing, Control and Telecommunication Technologies</li>
                <li><strong>Authors:</strong> Kavita Singh<sup>1</sup> (Guide), Wen-Cheng Lai<sup>2</sup> (Industrial Guide), Anushri Jamar<sup>3</sup>, Pracheta Khadgi<sup>4</sup>, Siddhi Patrange<sup>5</sup>, Avantika Sidam<sup>6</sup>, Anushka Mogare<sup>7</sup></li>
                <li><strong>DOI:</strong> <a href="https://doi.org/your-doi-link" target="_blank" rel="noreferrer">10.xxxx/ieee.iciot.2025</a></li>
              </ul>
            </div>

            {/* Right: Preview */}
            <div className="col-md-6 text-center" data-aos="fade-left">
              <iframe
                src="/paper.pdf" // Replace with actual path
                width="100%"
                height="500px"
                style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                title="Publication Preview"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <h2 className="section-title text-center mb-5" data-aos="fade-up">Contact Us</h2>
          <div className="row d-flex flex-wrap">
            <div className="col-md-5 contact-left mb-4" data-aos="fade-right">
              <p><i className="fa-solid fa-envelope"></i> contact@example.com</p>
              <p><i className="fa-solid fa-phone"></i> +91-956XXXXXXX</p>
              <p><i className="fa-solid fa-location-dot"></i> Nagpur, India</p>
              <div className="social-icons mt-4">
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin"></i></a>
              </div>
            </div>

            <div className="col-md-7 contact-right" data-aos="fade-left">
              <form name="submit-to-google-sheet">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" name="Name" placeholder="Your Name" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="email" name="Email" placeholder="Your Email" required />
                  </div>
                </div>
                <div className="mb-3">
                  <textarea name="Message" rows="5" placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn btn2">Submit</button>
                <span id="msg"></span>
              </form>
            </div>
          </div>
        </div>
      </section>


      <footer className="footer mt-5">
        <p>© 2025 Real-Time Human Detection App | Final Year Project | 
          Developed by Group M3</p>
      </footer>
    </>
  );
}

export default HomePage;
