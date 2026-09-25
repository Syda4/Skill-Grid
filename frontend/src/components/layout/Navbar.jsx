function Navbar({ user }) {
  return (
    <div className="navbar">
      <h3>Admin Dashboard</h3>

      <div>Welcome {user?.name}</div>
    </div>
  );
}

export default Navbar;
