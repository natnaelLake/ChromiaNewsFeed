import { createBrowserRouter } from "react-router-dom";
import NewsFeed from "./components/NewsFeed";
import NewsPost from "./components/NewsPost";
import UsersList from "./components/UserList";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <NewsFeed />,
      },
      {
        path: "/new-post",
        element: <NewsPost />,
      },
      {
        path: "/users",
        element: <UsersList />,
      },
    ],
  },
]);
