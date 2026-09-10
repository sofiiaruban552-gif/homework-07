import { useNavigate } from "react-router-dom";
import Surface from "../shared/Surface";
import Button from "../shared/Button";
import { ROUTES } from "@/types/routes";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <Surface className="error-page__surface">
        <div className="error-page__code">404</div>

        <h1 className="error-page__title">Page not found</h1>

        <p className="error-page__message">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved or no longer exists.
        </p>

        <div className="error-page__actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>

          <Button onClick={() => navigate(ROUTES.BOARD)}>Go to board</Button>
        </div>
      </Surface>
    </div>
  );
};

export default ErrorPage;
