import React from 'react';
import io from 'socket.io-client';

const SocketContext = React.createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const newSocket = io(window.location.origin, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    });

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
  const socket = React.useContext(SocketContext);
  if (socket === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
}