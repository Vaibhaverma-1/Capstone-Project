// src/test/mocks/browserMocks.ts

import "@testing-library/jest-dom";

const noop = () => {};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
  }),
});

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver as any;

if (!window.ShadowRoot) {
  (window as any).ShadowRoot = function ShadowRoot() {};
}

window.scrollTo = noop;

HTMLElement.prototype.scrollIntoView = noop;
HTMLElement.prototype.scroll = noop;
