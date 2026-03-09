import { useEffect, useState } from 'react'
import mainImg from './Images/main image.png'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [isLogin, setIsLogin] = useState({
    email: "",
    password: ""
  });

  const handleLogin = (e) => {
    setIsLogin({ ...isLogin, [e.target.name]: e.target.value })
  }

  const navigate = useNavigate();
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8008/user/login", isLogin);

      localStorage.setItem("token", res.data.token);

      alert(res.data.message);
      setTimeout(() => {
        navigate('/MainSection')
      }, 500);
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server not responding");
      }
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        await axios.get("http://localhost:8008/user/main", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/MainSection");
      } catch (err) {
        localStorage.removeItem("token");
      }
    }

    checkUser();
  },[]);

  return (
    <>
      <div className='w-full h-screen bg-linear-to-tl from-black via-neutral-900 to-neutral-700'>
        <div className="relative w-full h-screen overflow-hidden">
          <img
            src={mainImg}
            alt="Main"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl w-[90%] max-w-md text-white shadow-2xl">

              <h1 className="text-3xl font-bold text-center mb-6">
                LogIn
              </h1>

              <form onSubmit={submitLogin} className="space-y-4 text-left">
                <div>
                  <span className="text-sm block ml-1">Email</span>
                  <input
                    type="email"
                    placeholder="prince@gmail.com"
                    required
                    name='email'
                    onChange={handleLogin}
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
                  />
                </div>

                <div>
                  <span className="text-sm block ml-1">Password</span>
                  <input
                    type="password"
                    placeholder="******"
                    required
                    name='password'
                    onChange={handleLogin}
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
                  />
                </div>

                <button type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition duration-300 cursor-pointer hover:scale-95">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
