import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'
import { store } from './Redux/Store.jsx';
import { Provider, useSelector } from 'react-redux';
import { SocketProvider } from './Socket.jsx';
import ReactDOM from "react-dom/client";

const SocketWrapper = () => {
  const user = useSelector((state) => state.chat);
  
  return (
    <SocketProvider userId={user.id}>
      <App />
    </SocketProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <SocketWrapper />
    </BrowserRouter>
  </Provider>
);
