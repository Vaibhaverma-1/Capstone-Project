import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import "./404.css";
import { notFoundContent } from "src/stubs/notFoundStub";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (): void => {
    const userDetails = sessionStorage.getItem("userDetails");

    if (userDetails) {
      navigate("/dashboard");
    }else {
      navigate("/");
    }
  };

  return (
    <div className="not-found-container">
    <div className="not-found-card">
      <Result
        status="404"
        title={notFoundContent.title}
        subTitle={notFoundContent.subtitle}
        extra={
          <Button
            type="primary"
            onClick={handleNavigation}
            aria-label="Go Back"
          >
            Go Back
          </Button>
        }
      />
    </div>
    </div>
  );
};

export default NotFoundPage;
