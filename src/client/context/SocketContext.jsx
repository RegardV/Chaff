import React from 'react';
import io from 'socket.io-client';

const SocketContext = React.createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return React.useContext(SocketContext);
}