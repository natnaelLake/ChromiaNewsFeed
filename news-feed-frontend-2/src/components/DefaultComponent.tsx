// import NavBar from "./NavBar";
import { defaultComponentProps } from "./types";
import { Box } from "@mui/material";

const DefaultComponent = (props: defaultComponentProps) => {
  return (
    <Box flexDirection={"column"}>
      {/* <NavBar /> */}
      <Box maxHeight={"100vh"}>
        {props.children}
      </Box>
    </Box>
  );
};

export default DefaultComponent;
