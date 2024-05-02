/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { GetPostsReturnType } from "./types";
import { useEvmContext } from "./ContextProvider";
import { useQuery } from "../hooks";
import { Divider, List, ListItem, ListItemText } from "@mui/material";

interface themeTypes {
  [x: string]: any;
  breakpoints: any;
  shadows: any;
  palette: any;
  spacing: (value: number) => number;
  shape: {
    borderRadius: string;
  };
}

const useStyles = makeStyles((theme: themeTypes) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(8),
    },
  },
  followersFollowingBox: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[2],
    },
  },
  postContainer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(4),
  },
  postContent: {
    marginTop: theme.spacing(2),
  },
  postSeparator: {
    margin: `${theme.spacing(4)}px 0`,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  postItem: {
    marginBottom: theme.spacing(2),
  },
  postAuthor: {
    fontWeight: "bold",
  },
  postDate: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.fontSize * 0.8,
  },
  loading: {
    textAlign: "center",
  },
}));

const NewsFeed = () => {
  const classes = useStyles();
  const evmAddress = useEvmContext();
  const { result: userName } = useQuery<string>(
    "get_user_name",
    evmAddress ? { user_id: evmAddress } : undefined
  );
  const { result: followersCount } = useQuery<number>(
    "get_followers_count",
    evmAddress ? { user_id: evmAddress } : undefined
  );

  const { result: followingCount } = useQuery<number>(
    "get_following_count",
    evmAddress ? { user_id: evmAddress } : undefined
  );
  const { result: newsFeed, reload: reloadPosts } =
    useQuery<GetPostsReturnType>(
      "get_posts",
      evmAddress ? { user_id: evmAddress, n_posts: 10, pointer: 0 } : undefined
    );

  // Refresh posts every 10 seconds
  useEffect(() => {
    const refreshPosts = setInterval(() => {
      reloadPosts();
    }, 10000);
    return () => {
      clearInterval(refreshPosts);
    };
  });
  return (
    <Paper className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {userName}
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid item xs={6}>
              <Paper className={classes.followersFollowingBox}>
                <Typography variant="h6">Followers</Typography>
                <Typography variant="h3">{followersCount || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.followersFollowingBox}>
                <Typography variant="h6">Following</Typography>
                <Typography variant="h3">{followingCount || 0}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.postContainer}>
            <List>
              {newsFeed?.posts.map((post, index) => (
                <ListItem key={index} className={classes.postItem}>
                  <ListItemText
                    primary={
                      <>
                        <div className={classes.postAuthor}>
                          {post.user.name}
                        </div>
                        <div className={classes.postDate}>
                          {new Date(post.timestamp).toLocaleString()}
                        </div>
                      </>
                    }
                  />
                  <ListItemText secondary={post.content} />
                  <Divider variant="inset" component="li" />
                </ListItem>
              ))}
              {!newsFeed && <p className={classes.loading}>Loading...</p>}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NewsFeed;


// const NewsFeed = () => {
//   return (
//     <div>NewsFeed</div>
//   )
// }

// export default NewsFeed