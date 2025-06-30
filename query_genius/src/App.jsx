import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import History from "./pages/history/History";
import NavBar from "./components/NavBar";
import "./App.css";
import PrivateRoute from "./routes/protectedRoute";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <NavBar />
      <div className="page-content">{children}</div>
    </div>
  );
};

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/chat"
            element={
              <AppLayout>
                <Chat />
              </AppLayout>
            }
          />
          <Route
            path="/history"
            element={
              <AppLayout>
                <History />
              </AppLayout>
            }
          />

          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
