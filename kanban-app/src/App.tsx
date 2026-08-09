import { Route, Routes } from "react-router";
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
    </div>
  );
};

export default App;
