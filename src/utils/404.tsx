import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import "./404.css";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (): void => {
    navigate("/dashboard");
  };

  return (
    <div className="not-found-container">
    <div className="not-found-card">
      <Result
        status="404"
        title="404"
        subTitle="Oops! The page you are looking for could not be found. It may have been moved, deleted, or the URL might be incorrect."
        extra={
          <Button
            type="primary"
            onClick={handleNavigation}
            aria-label="Go back to dashboard"
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
    </div>
  );
};

export default NotFoundPage;
