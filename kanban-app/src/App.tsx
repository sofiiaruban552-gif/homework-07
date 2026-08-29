import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import BoardPage from "./components/pages/BoardPage/BoardPage";
import LoginPage from "./components/pages/LoadingPage/LoginPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";

import { ROUTES } from "./types/routes";

const App = () => {
  return (
    <div className="wrapper">
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route
          path={ROUTES.BOARD}
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default App;

