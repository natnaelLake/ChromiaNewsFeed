/* eslint-disable react-refresh/only-export-components */
// Define hooks for accessing context
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Session,
  createWeb3ProviderEvmKeyStore,
  createKeyStoreInteractor,
  createInMemoryFtKeyStore,
} from "@chromia/ft4";
// import { Buffer } from "buffer";
import * as pcl from "postchain-client";
import { getRandomUserName } from "../user";
// Define a global interface to extend the Window object with an ethereum property
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

const { ethereum } = window;
// Create a context for Chromia session
const ChromiaContext = createContext<Session | undefined>(undefined);
// Create a context for EVM address
const EvmContext = createContext<string | undefined>(undefined);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [evmAddress, setEvmAddress] = useState<Buffer | undefined>(undefined);
  console.log(".................................", ethereum);
  // window.ethereum = {
  //   isMetaMask: true,
  //   request: () => Promise.resolve([]),
  // };
  const initSession = async () => {
    console.log("Initializing Session");
    //     // 1. Initialize Client
    const client = await pcl.createClient({
      nodeUrlPool: "http://localhost:7740",
      blockchainIid: 0,
    });

    const evmKeyStore = await createWeb3ProviderEvmKeyStore(ethereum);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&1", evmKeyStore);
    setEvmAddress(evmKeyStore.address);
    // //     // 3. Get all accounts associated with evm address
    const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
    const accounts = await evmKeyStoreInteractor.getAccounts();

    console.log("--------------------------------------", accounts);
    if (accounts.length > 0) {
      // 4. Start a new session
      const sessionValue = await evmKeyStoreInteractor.login({
        accountId: accounts[0].id,
        config: {
          flags: ["MySession"],
          rules: null,
        },
      });
      setSession(sessionValue.session);
    } else {
      // 5. Create a new account by signing a message using metamask
      // 5.1 Sign message using metamask
      console.log("======================");
      const msg: string = await client.query("evm.get_register_message", {
        evm_address: evmKeyStore.address,
      });
      const signature = await evmKeyStore.signMessage(msg);

      // 5.2 Create a session keypair (SignatureProvider) and register account on dapp
      const sessionSignatureProvider = pcl.newSignatureProvider();
      await client.signAndSendUniqueTransaction(
        {
          name: "register_account",
          args: [
            getRandomUserName(),
            evmKeyStore.address,
            [signature.r, signature.s, signature.v],
          ],
        },
        sessionSignatureProvider
      );
      const account = (await evmKeyStoreInteractor.getAccounts())[0];
      // 6. Get session connected to the session keypair
      const sessionKeyStore = createInMemoryFtKeyStore(
        sessionSignatureProvider
      );
      const sessionKeyStoreInteractor = createKeyStoreInteractor(
        client,
        sessionKeyStore
      );
      setSession(await sessionKeyStoreInteractor.getSession(account.id));
    }
    console.log("Session initialized");
  };
  useEffect(() => {
    console.log("***********************",session);
    initSession();
  }, []);

  return (
    <ChromiaContext.Provider value={session}>
      <EvmContext.Provider value={evmAddress as unknown as string}>
        {children}
      </EvmContext.Provider>
    </ChromiaContext.Provider>
  );
}

// Custom hook to use EVM context
export function useEvmContext() {
  return useContext(EvmContext);
}

// Custom hook to use Chromia session context
export function useSessionContext() {
  return useContext(ChromiaContext);
}
