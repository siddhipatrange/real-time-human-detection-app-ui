// src/components/StrictlyProhibitedAreaPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { toast } from 'react-toastify';

const StrictlyProhibitedAreaPage = () => {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle video file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setResult(''); // Clear result on new upload
  };

  // Handle video analysis on button click
  const handleAnalyze = () => {
    if (!video) {
      toast.error("Please upload a video first!");
      return;
    }
  
    setIsLoading(true);
    setResult('');
  
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      setResult('Human detected! Alarm triggered!');
    }, 2000);
  };
  

  return (
    <div className="container strictly-prohibited-container">
      <div className="upload-card">
        <h1 className="title">Strictly Prohibited Area Monitoring</h1>
        <p className="subtitle">Upload a video for immediate analysis</p>

        {/* Video Upload Section */}
        <div className="upload-area">
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            onChange={handleUpload}
            className="file-input"
          />
          <label htmlFor="video-upload" className="file-label">
            {video ? video.name : 'Choose a video file'}
          </label>
        </div>

        {/* Video Preview */}
        {video && (
          <div className="video-preview">
            <video controls width="100%" height="auto">
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Loading and Result Section */}
        {isLoading && <div className="loader">Analyzing video...</div>}
        {result && <div className="result alert">{result}</div>}

        {/* Button Group */}
        <div className="button-group">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
                Back to Options
            </button>
            <button
                className="submit-button"
                disabled={isLoading}
                onClick={handleAnalyze}
            >
            {isLoading ? 'Processing...' : 'Analyze Video'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default StrictlyProhibitedAreaPage;
