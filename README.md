# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Main Features

- **React with Fast Refresh**: see changes immediately while developing.
- **TypeScript**: helps catch errors by checking types.
- **React Query**: handles fetching, caching, and updating notes from the server.
- **React Router**: for page routing and navigation.
- **Express server**: provides API endpoints to manage notes (`GET`, `POST`, `PUT`) stored in a JSON file.
- **CORS enabled**: allows the frontend to communicate with the server.
