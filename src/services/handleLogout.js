import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../contexts/userContext";

// create a custom hook of logout
export function useLogout() {
  const navigate = useNavigate();
  // import global data
  const { globalUser, setGlobalUser, globalStatus, setGlobalStatus } =
    useContext(MyContext);

  const handleLogout = () => {
    alert(
      "Bye " +
        globalUser.name.charAt(0).toUpperCase() +
        globalUser.name.slice(1) +
        "! Have a great day!"
    );
    setGlobalUser("");
    setGlobalStatus(false);
    navigate("/login");
  };

  return handleLogout;
}
