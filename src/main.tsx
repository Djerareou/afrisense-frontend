import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/global.css";

import { GoogleOAuthProvider } from '@react-oauth/google';
// Dev-only error overlay to display uncaught errors in the app UI
import ErrorOverlay from './components/Debug/ErrorOverlay';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
      {import.meta.env.DEV && <ErrorOverlay />}
    </GoogleOAuthProvider>
  </React.StrictMode>
);
