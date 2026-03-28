import { Link } from 'react-router'
import mainImg from './Images/main image.png'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from './Redux/HandleSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isSign, setIsSign] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSignup = (e) => {
        setIsSign({ ...isSign, [e.target.name]: e.target.value });
    }

    const submitSignup = async (e) => {
        e.preventDefault();

        try {

            localStorage.removeItem("token");

            const res = await axios.post(
                "http://localhost:8008/user/signup",
                isSign
            );

            localStorage.setItem("token", res.data.token);
            navigate('/MainSection');
            dispatch(setUser({
                id: res.data.data._id,
                name: res.data.data.name
            }));

        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }
    };

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
                                Sign Up
                            </h1>

                            <form onSubmit={submitSignup} className="space-y-4 text-left">
                                <div>
                                    <span className="text-sm block ml-1">Full Name</span>
                                    <input
                                        type="text"
                                        placeholder="Prince Singh"
                                        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
                                        required
                                        name='name'
                                        onChange={handleSignup}
                                    />
                                </div>

                                <div>
                                    <span className="text-sm block ml-1">Email</span>
                                    <input
                                        type="email"
                                        placeholder="prince@gmail.com"
                                        required
                                        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
                                        name='email'
                                        onChange={handleSignup}
                                    />
                                </div>

                                <div>
                                    <span className="text-sm block ml-1">Password</span>
                                    <input
                                        type="password"
                                        placeholder="******"
                                        required
                                        name='password'
                                        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
                                        onChange={handleSignup}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition duration-300 cursor-pointer hover:scale-95"
                                >
                                    Sign Up
                                </button>
                            </form>

                            {/* Toggle */}
                            <p className="text-center mt-4 text-sm">
                                Have an account?
                                <Link to="/Login" className="text-indigo-400 font-semibold cursor-pointer ml-1">
                                    Login
                                </Link>
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home
