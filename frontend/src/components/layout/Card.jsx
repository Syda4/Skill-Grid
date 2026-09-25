import "./css/Card.css";

function Card({ title, value, icon }) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <h1>{value}</h1>
      </div>
    </div>
  );
}

export default Card;
