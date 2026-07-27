import { Navigate, Route, Routes } from "react-router";
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

        <Route path="*" element={<Navigate to={ROUTES.BOARD} replace />} />
      </Routes>
    </div>
  );
};

export default App;
