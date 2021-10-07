import React , {useState , useEffect } from 'react';
import {Container , Card , Form, Col , Row, InputGroup, Button , Badge } from 'react-bootstrap';
import socket from './Socket';

function App() {

  
  const [logedin , setlogedin] = useState(false);

  const [state , setState] = useState({room: '', name: '' , message: ''});
  const [chat , setChat] = useState([]);

  useEffect(() => {
    
    socket.on("message", ({room , name , message }) => {
      setChat([ ...chat, {room , name , message } ])
    })

  } , [chat]);

  const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

  const joinRoom = (e) => {
    e.preventDefault();
    setlogedin(true);
    socket.emit('join_room' , state.room)
    socket.emit("welcome_message", {room: state.room , name: 'Admin' , message: state.name+' Joined the chat' });
  }

  const handleSubmit = (e) => {
      e.preventDefault();

      const {room , name , message } = state;
      socket.emit("message", {room , name , message });
      setState({room , name , message: ''});

  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col md="3"></Col>
          <Col md="6" className="mt-4">
            <h2 className="text-center">CRAIGS CHAT APP</h2>
          </Col>
          <Col md="3"></Col>

          {
          !logedin ? (

            <>
              <Col md="3"></Col>

              <Col md="6" className="mt-4">
                <Card>
                  <Card.Header>
                    Join Room
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={joinRoom}>
                      <InputGroup>
                      <Form.Control name="room" value={state.room} onChange={(e) => onTextChange(e)} placeholder="Room" type="text"/>
                      <Form.Control name="name" value={state.name} onChange={(e) => onTextChange(e)} placeholder="Username" type="text"/>
                        <InputGroup.Append>
                          <Button type="submit">Join</Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col md="3"></Col>
            </>

          ) : (

              <>
              <Col md="3"></Col>

                <Col md="6" className="mt-4">
                  <Card>
                    <Card.Header>
                    {state.room}
                    </Card.Header>
                    <Card.Body style={{height: '600px' , overflowY: 'auto'}}>
                      {
                        chat.map(({name , message} , index) => {

                          if(name == state.name){
                              return(
                                <div key={index} className='text-end'><span className="bg-primary p-1 ps-2 pe-2 text-white">{message}</span><br/><small style={{fontSize: '11px' , lineHeight: '1em'}}>{name}</small></div>
                              )
                          }else if(name === 'Admin'){
                            return(
                              <div key={index} className='text-secondary text-center'><small>{message}</small></div>
                            )
                          }else{
                            return(
                              <div key={index} className='text-start'><span className="bg-secondary p-1 ps-2 pe-2 text-white">{message}</span><br/><small style={{fontSize: '11px' , lineHeight: '1em'}}>{name}</small></div>
                            )
                          }
                  
                        })
                      }
                    </Card.Body>
                    <Card.Footer>
                      <Form onSubmit={handleSubmit}>
                        <InputGroup>
                          <Form.Control name="message" value={state.message} onChange={(e) => onTextChange(e)} type="text"/>
                          <InputGroup.Append>
                            <Button type="submit">Submit</Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </Form>
                    </Card.Footer>
                  </Card>
                </Col>

                <Col md="3"></Col>
              </>

          )
          }

         

        </Row>
      </Container>    
    </div>
  );

}

export default App;
