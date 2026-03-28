import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mainImg from './Images/main image.png';
import sendImg from './Images/send.png';
import { useSelector } from "react-redux";
import { useSocket } from "./Socket";

const MainSection = () => {

  const [inputdata, setInputData] = useState("");
  const [searchInp, setSearchInp] = useState('');
  const [uesrName, setUserName] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();
  const user = useSelector((state) => state.chat);
  const refe = useRef(null);
  const searRef = useRef(null);
  const socket = useSocket();
  const token = localStorage.getItem("token");

  //Here check the jwt token
  useEffect(() => {
    const fetchMain = async () => {
      if (!token) {
        return navigate('/');
      }
      try {
        const res = await axios.get('http://localhost:8008/user/main', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      } catch (err) {
        localStorage.removeItem('token');
        navigate("/")
      }
    }
    fetchMain();
  }, []);

  useEffect(() => {
    if (!socket || !selectedUser || !user?.id) return;

    const handleNewMessage = (newMsg) => {

      const isConversationMessage =
        (
          newMsg.senderId?.toString() === user.id &&
          newMsg.receiverId?.toString() === selectedUser._id
        ) ||
        (
          newMsg.senderId?.toString() === selectedUser._id &&
          newMsg.receiverId?.toString() === user.id
        );

      if (isConversationMessage) {

        setMessages(prev => {

          // prevent duplicate
          const exists = prev.some(m => m._id === newMsg._id);

          if (exists) return prev;

          return [...prev, newMsg];
        });

      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);

  }, [socket, selectedUser, user.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const res = await axios.get(
          `http://localhost:8008/api/getMessages/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  const handleChatData = async () => {
    if (!selectedUser) {
      return alert("Select a user first");
    }

    try {
      const res = await axios.post(
        `http://localhost:8008/api/sendMessage/${selectedUser._id}`,
        {
          message: inputdata
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistic update (important for UX)
      setMessages((prev) => [...prev, res.data]);

      setInputData("");
      refe.current.value = "";

    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchBox = async (e) => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios.get(`http://localhost:8008/api/getUser?search=${searchInp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserName(res.data.users);
      searRef.current.value = "";
    }
    catch (err) {
      console.log(err);
    }
  }

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

          <div className="absolute inset-0 flex flex-col text-white text-center p-3">
            <div className="w-full bg-neutral-800 rounded-2xl text-white shadow-2xl py-6 flex justify-between">
              <div className="w-[35%] flex">
                <input
                  type="text"
                  placeholder="Search box"
                  ref={searRef}
                  className="border border-neutral-300 ml-5 px-3 py-3 w-full rounded-3xl hover:scale-105 cursor-pointer duration-300 focus:outline-none focus:ring-0"
                  onChange={(e) => setSearchInp(e.target.value)}
                />
                <button className="font-bold py-2 px-3 hover:scale-105 duration-300 hover:text-neutral-300 cursor-pointer"
                  onClick={handleSearchBox}
                >Search</button>
              </div>

              <div>
                <h1 className="text-sm sm:text-xl font-medium tracking-widest mr-8 mt-2">{user.user}</h1>
              </div>
            </div>

            <div className="w-full h-full mt-5 flex justify-between">
              <div className="w-full md:w-[37%] bg-neutral-900 rounded-2xl text-white shadow-sm shadow-neutral-400">
                <ul className="p-4">
                  {uesrName.map((user) => {
                    return (
                      <li
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setMessages([]); // clear old chat
                        }}
                        className="cursor-pointer"
                      >
                        {user.name}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="w-[60%] bg-black/30 hidden md:flex flex-col  backdrop-blur-lg border border-white/30 rounded-2xl text-white shadow-2xl">
                <div className="w-full h-[90%] p-4 flex items-end">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`w-full flex ${msg.senderId?.toString() === user.id
                        ? "justify-end"
                        : "justify-start"
                        }`}
                    >
                      <span className="bg-neutral-700 px-4 py-2 rounded-2xl m-1">
                        {msg.message}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-full h-[12%] p-5">
                  <div className="relative w-full">

                    <input
                      ref={refe}
                      type="text"
                      placeholder="Type a message"
                      className="w-full bg-neutral-700 py-3 pl-3 pr-12 rounded-3xl border border-neutral-500 focus:outline-none focus:ring-0"
                      onChange={(e) => setInputData(e.target.value)}
                    />

                    <img
                      src={sendImg}
                      alt="Send"
                      className="w-7 h-7 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 duration-300"
                      onClick={handleChatData}
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default MainSection
