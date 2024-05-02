import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import DefaultComponent from "./components/DefaultComponent";
// import { ContextProvider } from "./components/ContextProvider";
function App() {

  return (
    <div>
      <NavBar />
      <DefaultComponent>{<Outlet />}</DefaultComponent>
    </div>
  );
}

export default App;
