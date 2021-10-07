import io from 'socket.io-client';

const socket = io('https://cd-react-chat-app.herokuapp.com/');
socket.connect({reconnect: true, forceNew: true});

export default socket;