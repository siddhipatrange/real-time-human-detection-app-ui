// src/components/ProhibitedAreaPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { toast } from 'react-toastify';

const ProhibitedAreaPage = () => {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  // Handle video file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setResult('');  // Clear the result when a new video is uploaded
  };

  // Handle the video analysis when "Analyze Video" button is clicked
  const handleAnalyze = async () => {
    if (!video) {
      toast.error("Please upload a video first!");
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const formData = new FormData();
      formData.append("video", video);

      console.log("Sending to backend:", video.name);

      const response = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setResult("Error analyzing video.");
      } else {
        const { action, confidence } = data;
        setResult(`Action detected: ${action} (Confidence: ${(confidence * 100).toFixed(2)}%)`);

        // Only show alarm for prohibited activities
        if (["sword_exercise", "shoot_gun", "punch", "kick", "hit", "fencing", "climb", "smoke"].includes(action)) {
          toast.warn("🚨 Prohibited activity detected!");
          setAlarmTriggered(true);
          const alarm = new Audio('/alarm/alarm_sound.mp3');
          alarm.play();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to analyze video.");
      setResult("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container prohibited-area-container">
      <div className="upload-card">
        <h1 className="title">Prohibited Area Monitoring</h1>
        <p className="subtitle">Upload a video for analysis</p>

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
        {result && <div className="result">{result}</div>}

        {/* Buttons */}
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
            {alarmTriggered && (
              <div style={{ marginTop: "2rem" }}>
                <button
                  className="stop-button blinking"
                  onClick={async () => {
                    try {
                      await fetch("/stop-alarm", { method: "POST" });
                      toast.success("Alarm stopped!");
                      setAlarmTriggered(false); // Hide the button again
                    } catch (err) {
                      toast.error("Failed to stop alarm.");
                    }
                  }}
                >
                  🚨 Stop Alarm
                </button>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProhibitedAreaPage;
