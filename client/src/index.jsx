import ReactDOM from "react-dom/client";
import "./index.css";
import {Provider} from 'react-redux'
import App from "./App";
import { ThemeProvider } from "./componets/ThemeProvider";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
);
