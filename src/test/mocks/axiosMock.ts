const mockAxiosRequest = jest.fn();

const mockAxiosInstance = Object.assign(mockAxiosRequest, {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  request: mockAxiosRequest,
});

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  create: jest.fn(() => mockAxiosInstance),
}));

export {};

