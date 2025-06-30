import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">
          Welcome to <span className="highlight">Query Genius</span> 👋
        </h1>
        <p className="home-subtitle">
          Start by heading to <strong>Chat</strong> or explore your{" "}
          <strong>History</strong>.
        </p>
      </div>
    </div>
  );
};

export default Home;
