import { useContext } from "react";
import { Web3ContextType, Web3Context } from "../contexts/Web3context";

const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export default useWeb3