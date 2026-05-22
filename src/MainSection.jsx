import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mainImg from './Images/main image.png';
import sendImg from './Images/send.png';
import { useSelector } from "react-redux";
import { useSocket } from "./Socket/Socket.jsx";

const MainSection = () => {

  const [inputdata, setInputData] = useState("");
  const [searchInp, setSearchInp] = useState('');
  const [uesrName, setUserName] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);

  const navigate = useNavigate();
  const ReduxUser = useSelector((state) => state.chat);
  const refe = useRef(null);
  const searRef = useRef(null);
  const socket = useSocket();
  const chatEndRef = useRef(null);

  //Here check the jwt token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchMain = async () => {
      if (!token) {
        return navigate('/');
      }
      try {
        await axios.get('http://localhost:8008/user/main', {
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

  const addMessageSafely = (newMsg) => {
    setMessages(prev => {

      const exists = prev.some(
        m => m._id?.toString() === newMsg._id?.toString()
      );

      if (exists) return prev;
      return [...prev, newMsg];
    });
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMsg) => {
      addMessageSafely(newMsg);
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const res = await axios.get(
          `http://localhost:8008/api/getMessage/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

        setMessages(
          res.data.filter(
            (msg, index, self) =>
              index === self.findIndex(m =>
                m._id?.toString() === msg._id?.toString()
              )));
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  const handleChatData = async () => {
    const token = localStorage.getItem("token");
    if (!inputdata.trim()) return;

    if (!selectedUser) {
      return alert("Select a user first");
    }

    try {
      const res = await axios.post(
        `http://localhost:8008/api/sendMessage/${selectedUser._id}`,
        {
          message: inputdata,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      console.log(token);
      addMessageSafely(res.data);
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

  useEffect(() => {

    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8008/api/conversations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const users = res.data.map((conv) => {
          return conv.members.find((member) =>
            member?._id?.toString() !== ReduxUser?.id?.toString()
          );
        }).filter(Boolean);

        setChatUsers(users);

      } catch (err) {
        console.log(err);
      }
    };
    fetchConversations();
  }, []);

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

          <div className="absolute inset-0 flex flex-col text-center p-3">

            <div className="w-full bg-neutral-800 rounded-2xl text-white shadow-2xl py-6 flex justify-between">
              <div className="md:w-[35%] flex">
                <input
                  type="text"
                  placeholder="Search box"
                  ref={searRef}
                  className="border border-neutral-300 ml-5 px-4 py-1.5 md:px-3 md:py-3 w-full rounded-3xl hover:scale-105 cursor-pointer duration-300 focus:outline-none focus:ring-0"
                  onChange={(e) => setSearchInp(e.target.value)}
                />
                <button className="md:font-bold text-sm md:py-2 md:px-3 ml-5 hover:scale-105 duration-300 hover:text-neutral-300 cursor-pointer"
                  onClick={handleSearchBox}
                >Search</button>
              </div>

              <div className="md:flex hidden">
                <h1 className="text-sm sm:text-xl  font-medium tracking-widest mr-8 mt-2">{ReduxUser.user}</h1>
              </div>
            </div>

            <div className="w-full h-full mt-5 flex justify-between">

              {/* LEFT SIDEBAR */}
              <div
                className={`${mobileChatOpen ? "hidden" : "flex"} md:flex flex-col w-full md:w-[40%] h-full`}>

                <div
                  className="md:w-[90%] h-12 bg-neutral-700 text-neutral-200 rounded-2xl"
                  style={{
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}>
                  <ul>
                    {uesrName.map((searchUser) => {
                      return (
                        <li
                          key={searchUser._id}
                          onClick={() => {
                            setSelectedUser(searchUser);
                            setShowDefault(true);
                            setMobileChatOpen(true);

                            setChatUsers((prev) => {
                              const alreadyExist = prev.find(
                                u => u._id === searchUser._id
                              );

                              if (alreadyExist) return prev;
                              return [...prev, searchUser];
                            });
                          }}
                          className="p-2.5 pl-8 text-left tracking-widest font-medium cursor-pointer"
                        >
                          {searchUser.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* CHAT USERS */}
                <div className="md:w-[90%] h-full mt-3 bg-neutral-900 rounded-2xl text-white shadow-sm shadow-neutral-400">
                  <ul className="p-4">
                    {chatUsers.map((chatUser) => (
                      <li
                        key={chatUser._id}
                        onClick={() => {
                          setSelectedUser(chatUser);
                          setShowDefault(true);
                          setMobileChatOpen(true);
                        }}
                        className={`px-2 py-2 cursor-pointer font-serif tracking-wider text-left pl-3 ${selectedUser?._id === chatUser._id
                          ? "bg-neutral-800 rounded-2xl"
                          : ""
                          }`}
                      >
                        {chatUser.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`${mobileChatOpen ? "flex" : "hidden"} md:flex flex-col w-full md:w-[60%] bg-black/30 backdrop-blur-lg border border-white/30 rounded-2xl text-white shadow-2xl `}>
                {/* MOBILE BACK BUTTON */}
                <div className="md:hidden p-3 flex justify-end pr-3 border-neutral-700">
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="bg-neutral-700 px-2 py-1 rounded-xl text-sm hover:scale-105 duration-300">
                    Back
                  </button>
                </div>

                {/* MESSAGES */}
                <div
                  className="w-full h-[90%] overflow-y-auto p-4 flex flex-col gap-2"
                  style={{
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {
                    showDefault ? (
                      messages.map((msg) => {
                        const isMe = msg.senderId === ReduxUser.id;

                        return (
                          <div
                            key={msg._id.toString()}
                            className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] px-3 py-1.5 rounded-2xl text-sm wrap-break-word ${isMe
                                ? "bg-[#017a64] text-white rounded-br-sm border"
                                : "bg-[#234232] text-white rounded-bl-sm border"
                                }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="hidden md:flex justify-center items-center h-full">
                        <p className="text-3xl font-mono">
                          Select a user to start chatting 💬
                        </p>
                      </div>
                    )
                  }

                  <div ref={chatEndRef}></div>
                </div>

                {/* INPUT */}
                {
                  showDefault && (
                    <div className="w-full h-[12%] p-5">
                      <div className="relative w-full">

                        <input
                          ref={refe}
                          type="text"
                          placeholder="Type a message"
                          className="w-full bg-neutral-700 py-3 pl-3 pr-12 rounded-3xl border border-neutral-500 focus:outline-none"
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
                  )
                }
              </div>
            </div>
          </div>

        </div>
      </div >
    </>
  )
}

export default MainSection