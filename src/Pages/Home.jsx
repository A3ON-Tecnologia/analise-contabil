export default function Home({ onLogout }) {
  return (
    <div className="home-container">
      <h1>Área Interna</h1>
      <button onClick={onLogout}>Sair</button>
    </div>
  );
}
