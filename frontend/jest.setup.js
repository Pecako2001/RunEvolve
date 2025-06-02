// jest.setup.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock next/router for components that use it (like Link or useRouter)
// If not using next-router-mock, you might need a more manual mock:
// jest.mock('next/router', () => ({
//   useRouter() {
//     return {
//       route: '/',
//       pathname: '',
//       query: '',
//       asPath: '',
//       push: jest.fn(),
//       events: {
//         on: jest.fn(),
//         off: jest.fn()
//       },
//       beforePopState: jest.fn(() => null),
//       prefetch: jest.fn(() => null)
//     };
//   },
// }));

// Fix for "ReferenceError: TextEncoder is not defined"
// This can happen when a package (like Mantine) uses TextEncoder/TextDecoder
// and it's not available in the JSDOM environment by default.
if (typeof TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
  global.TextDecoder = require("util").TextDecoder;
}
