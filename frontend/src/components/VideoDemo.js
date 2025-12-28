// In your React component
function VideoSection() {
  return (
    <div style={{ textAlign: 'center', margin: '40px 0' }}>
      <h3>Platform Demo</h3>
      <video 
        width="800" 
        height="450" 
        controls
        style={{ maxWidth: '100%', borderRadius: '12px' }}
      >
        <source src="https://your-cloud-url.com/demo-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}