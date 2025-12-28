import React from 'react';

function VideoTest() {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      background: 'red' 
    }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1
        }}
      >
        <source src="video_20251228_113341_edit.mp4" type="video/mp4" />
      </video>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '24px',
        zIndex: 2,
        background: 'rgba(0,0,0,0.5)',
        padding: '20px'
      }}>
        VIDEO TEST
      </div>
    </div>
  );
}

export default VideoTest;