import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
}
