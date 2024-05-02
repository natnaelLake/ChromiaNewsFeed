import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, TextareaAutosize, CircularProgress } from "@mui/material";
import { useSessionContext } from "./ContextProvider";
interface themeTypes {
  spacing: (value: number) => number;
  shape: {
    borderRadius: string;
  };
}
const useStyles = makeStyles((theme:themeTypes) => ({
  root: {
    padding: theme.spacing(6),
  },
  textarea: {
    width: "100%",
    padding: theme.spacing(2),
    border: "1px solid",
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    float: "right",
  },
}));

export default function NewsPost() {
  const router = useNavigate();
  const classes = useStyles();
  const session = useSessionContext();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleContentChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setContent(e.target.value);
  };

  const onSubmit = async (data: string) => {
    if (!session) return
    try {
      if (data.trim() !== '') {
        setIsLoading(true);
        // Step 4: Content submission
        await session.call({
          name: "make_post",
          args: [data],
        })
        router('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setContent("");
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <TextareaAutosize
        className={classes.textarea}
        // rowsMin={4}
        placeholder="Write your post..."
        value={content}
        onChange={handleContentChange}
        
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        disabled={isLoading || content.trim() === ""}
        onClick={() => onSubmit(content)}
      >
        {isLoading ? <CircularProgress size={24} /> : "Post"}
      </Button>
    </div>
  );
}


// const NewsPost = () => {
//   return (
//     <div>NewsPost</div>
//   )
// }

// export default NewsPost