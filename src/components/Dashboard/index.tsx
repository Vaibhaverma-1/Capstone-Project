import React from "react";
import {
Row,
Col,
Card,
Typography,
Button,
Space,
Progress,
Statistic,
} from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { dashboardData } from "../../stubs/dashboardStub";
import "./Dashboard.css";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>Dashboard</Title>
        <Text className="dashboard-subtitle">
        Operational Overview
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Space direction="vertical">
              <AppstoreOutlined className="dashboard-icon" />
              <Text>Total Assets</Text>
              <Title level={3}>
                {dashboardData.totalAssets}
              </Title>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Space direction="vertical">
              <FileTextOutlined className="dashboard-icon" />
              <Text>Total Requests</Text>
              <Title level={3}>
                {dashboardData.totalRequests}
              </Title>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Space direction="vertical">
              <ToolOutlined className="dashboard-icon" />
              <Text>Maintenance Orders</Text>
              <Title level={3}>
                {dashboardData.maintenanceOrders}
              </Title>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Space direction="vertical">
              <UserOutlined className="dashboard-icon" />
              <Text>Work Instructions</Text>
              <Title level={3}>
                {dashboardData.workInstructions}
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>

<Row gutter={[16, 16]} className="dashboard-section">
  <Col xs={24} lg={12}>
    <Card
      title="Task Summary"
      className="dashboard-widget"
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div className="summary-card">
            <Text className="summary-label">
              Pending Requests
            </Text>
            <Title level={3} className="summary-value">
              {dashboardData.pendingRequests}
            </Title>
          </div>
        </Col>

        <Col span={12}>
          <div className="summary-card">
            <Text className="summary-label">
              Completed Tasks
            </Text>
            <Title level={3} className="summary-value">
              {dashboardData.completedTasks}
            </Title>
          </div>
        </Col>
      </Row>
    </Card>
  </Col>

  <Col xs={24} lg={12}>
<Card
  title="Request Status"
  className="dashboard-widget"
>
  <Row gutter={[24, 24]} justify="center">
    <Col>
      <div className="status-chart">
        <Progress
          type="circle"
          percent={dashboardData.requestStatus.pending}
          strokeColor="#faad14"
          size={110}
        />
        <Text>Pending</Text>
      </div>
    </Col>

    <Col>
      <div className="status-chart">
        <Progress
          type="circle"
          percent={dashboardData.requestStatus.inProgress}
          strokeColor="#1677ff"
          size={110}
        />
        <Text>In Progress</Text>
      </div>
    </Col>

    <Col>
      <div className="status-chart">
        <Progress
          type="circle"
          percent={dashboardData.requestStatus.completed}
          strokeColor="#52c41a"
          size={110}
        />
        <Text>Completed</Text>
      </div>
    </Col>
  </Row>
</Card>
  </Col>
</Row>

<Row className="dashboard-section">
  <Col span={24}>
    <Card
      title="Monthly Request Trends"
      className="dashboard-widget"
    >
      <Row gutter={[16, 16]}>
        {dashboardData.monthlyRequests.map((item) => (
      <Col xs={12} md={4} key={item.month}>
      <Statistic
      title={item.month}
      value={item.value}
      />
      </Col>
      ))}
      </Row>

      <Progress
        percent={dashboardData.requestCompletionRate}
        strokeColor="#52c41a"
        showInfo={false}
      />
    </Card>
  </Col>
</Row>

<Row className="dashboard-section">
  <Col span={24}>
    <Card
      title="Quick Navigation"
      className="dashboard-widget"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Button
            className="navigation-button"
            aria-label="Navigate to maintenance-orders"
            onClick={() =>
              navigate("/maintenance-orders")
            }
          >
            Maintenance Orders
          </Button>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Button
            className="navigation-button"
            aria-label="Navigate to work-instructions"
            onClick={() =>
              navigate("/work-instructions")
            }
          >
            Work Instructions
          </Button>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Button
            className="navigation-button"
            aria-label="Navigate to requests"
            onClick={() =>
              navigate("/requests")
            }
          >
            My Requests
          </Button>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Button
            className="navigation-button"
            aria-label="Navigate to profile"
            onClick={() =>
              navigate("/profile")
            }
          >
            Profile
          </Button>
        </Col>
      </Row>
    </Card>
  </Col>
</Row>
    </div>
  );
};

export default Dashboard;
