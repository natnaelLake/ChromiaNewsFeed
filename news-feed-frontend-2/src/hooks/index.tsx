/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { RawGtv, DictPair } from "postchain-client";
import { useSessionContext } from "../components/ContextProvider"; // Assuming you have a session context hook

export function useQuery<
  TReturn extends RawGtv,
  TArgs extends DictPair | undefined = DictPair
>(name: string, args?: TArgs) {
  const session = useSessionContext();
  const [serializedArgs] = useState<string | undefined>(
    args ? JSON.stringify(args) : undefined
  );
  const [data, setData] = useState<TReturn | undefined>();

  // Function to send the query
  const sendQuery = useCallback(async () => {
    if (!session || !args) return;
    try {
      const queryData:any = await session.query<TReturn>({ name: name, args: args });
      setData(queryData);
    } catch (error) {
      console.error("Error executing query:", error);
    }
  }, [session, name, args]);

  // Trigger the query when session, query name, or arguments change
  useEffect(() => {
    if (serializedArgs) {
      sendQuery().catch(console.error);
    }
  }, [session, name, serializedArgs, sendQuery]);

  // Function to reload the query
  const reload = useCallback(() => {
    if (serializedArgs) {
      sendQuery().catch(console.error);
    }
  }, [serializedArgs, sendQuery]);

  // Return query result and reload function
  return {
    result: data,
    reload: reload,
  };
}
