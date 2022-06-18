import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { BackButton } from './Utility';


function LoginForm(props) {
  const [username, setUsername] = useState('test@polito.it');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    // validetion
    let valid = true;
    if (username === '') {
      valid = false;
      setErrorMessage('Inserire username valido');
    } else if (password === '') {
      valid = false;
      setErrorMessage('Inserire password valida');
    }
    if (valid) {
      props.login(credentials);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center"><Col xs={6}>
        {errorMessage ? <Alert className='text-center' variant='danger' onClose={() => setErrorMessage('')} dismissible>{errorMessage}</Alert> : ''}
      </Col></Row>
      <BackButton setDirty={props.setDirty} />
      <Row className="justify-content-center">
        <Col xs={6}>
          <h2 className='text-center'>Login</h2>
          <Form >
            <Form.Group controlId='username'>
              <Form.Label>Email:</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group className='' controlId='password'>
              <Form.Label>Password:</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Col className='text-center my-3'>
              <Button onClick={handleSubmit}>Login</Button>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export { LoginForm };