/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEvmContext, useSessionContext } from "./ContextProvider";
import { useQuery } from "../hooks";
import { UsersDto } from "./types";
import { Buffer } from "buffer";
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

const useStyles = makeStyles((theme:themeTypes) => ({
  userItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(4),
  },
  userAvatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    backgroundColor: theme.palette.grey[300],
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing(4),
  },
  button: {
    float: "right",
  },
}));

export default function UserItem({ user }: { user: UsersDto }) {
  const classes = useStyles();
  const session = useSessionContext();
  const evmAddress = useEvmContext();
  const { result: isFollowing, reload: updateIsFollowing } = useQuery<boolean>("is_following", evmAddress ? { my_id: evmAddress, your_id: user.id } : undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isFollowing, setIsFollowing] = useState<boolean>(false);

const handleFollowClick = async (userId: Buffer, follow: boolean) => {
    if (!session) return
    try {
      setIsLoading(true);
      // Step 3: Handle follow/unfollow logic
      await session.call({
        name: follow ? "follow_user" : "unfollow_user",
        args: [userId as unknown as string]
      });
      updateIsFollowing();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.userItem}>
      <div className="flex items-center">
        <Avatar className={classes.userAvatar}>{user.name[0]}</Avatar>
        <span className="text-lg font-semibold">{user.name}</span>
      </div>
      <Button
        className={classes.button}
        variant="contained"
        color={isFollowing ? "secondary" : "primary"}
        disabled={isLoading}
        onClick={() => handleFollowClick(user.id , !isFollowing)}
      >
        {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}


// const UserItem = () => {
//   return (
//     <div>UserItem</div>
//   )
// }

// export default UserItem