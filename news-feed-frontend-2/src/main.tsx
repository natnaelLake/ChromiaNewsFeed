import ReactDOM from "react-dom/client";
import { router } from "./routes.tsx";
import { RouterProvider } from "react-router-dom";
// import "./index.css";
import { ContextProvider } from "./components/ContextProvider.tsx";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";
const theme = createTheme({
  // Define your theme properties here
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ContextProvider>
    <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
    </ThemeProvider>
  </ContextProvider>
);
