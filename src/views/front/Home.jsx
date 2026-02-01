function Home() {
  return (
    <div className="container-flulid">
      <img
        src={`${import.meta.env.BASE_URL}images/sweet.jpg`}
        alt="酸甜告白"
        className="img-fluid hero-section"
      />
    </div>
  );
}

export default Home;
