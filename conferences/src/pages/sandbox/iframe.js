const EmbedTest = props => {
  const url = 'http://localhost:7777/media/876dfad0-8617-4f53-9d32-1c6b1358c54f';

  return (
    <div style={{ height: '100vh' }}>
      <iframe
        width="600px"
        height="1000px"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default EmbedTest;
