/* eslint-disable @typescript-eslint/no-explicit-any */
import UserItem from "./UserItem";
import { List, ListItem, Divider } from "@mui/material";
import { useQuery } from "../hooks";
import { GetUsersReturnType } from "./types";
export default function UsersList() {
  // Define an example array of users
  const { result: users } = useQuery<GetUsersReturnType>("get_users", { PointerEvent: 0, n_users: 10 });
  console.log('++++++++++++++++++++++',users)
//   const users: GetUsersReturnType | undefined = {
//     pointer: 0,
//     users: [{ name: "User1", id: Buffer.from("AB", "hex") }],
//   };

  return (
    <div className="p-4 md:p-8">
      <List>
        {users && users.users.length > 0 ? (
          users.users.map((user:any, index:number) => (
            <ListItem key={user.id.toString()}>
              {/* Render the UserItem component for each user */}
              <UserItem user={user} />
              {/* Add a horizontal line between user items */}
              {index < users.users.length - 1 && <Divider />}
            </ListItem>
          ))
        ) : (
          <></>
        )}
      </List>
    </div>
  );
}


// const UserList = () => {
//   return (
//     <div>UserList</div>
//   )
// }

// export default UserList