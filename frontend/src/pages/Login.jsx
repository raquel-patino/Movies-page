import { useEffect, useState } from "react";

function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
      });
  }, []);

  return (
    <div>
      {user ? (
        <p>Bienvenido, {user.name}</p>
      ) : (
        <a href="http://localhost:5000/login">
          <button>Login con Google</button>
        </a>
      )}
    </div>
  );
}

export default Login;
