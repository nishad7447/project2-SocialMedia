import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from 'react-redux'
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import { store } from "./redux/store";
import ChatProvider from "./components/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ThemeProvider>
  </Provider>
);
