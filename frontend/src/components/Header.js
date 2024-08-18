import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'

function Header() {
  return (
    <header>
      <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />  
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav className="mr-auto px-4">
              <Nav.Link href="/calculator"><i className='fas fa-shopping-cart'></i>Calculator</Nav.Link>
              <Nav.Link href="/advantages"><i className='fas fa-user'></i>Advantages</Nav.Link>
            </Nav>
            <Navbar.Brand href="/" className="mx-auto">Insight AI</Navbar.Brand>
            <Nav className="ml-auto px-4">
              <Nav.Link href="/contact"><i className='fas fa-user'></i>Contact</Nav.Link>
              <Nav.Link href="/hire"><i className='fas fa-user'></i>Hire us!</Nav.Link>
            </Nav>
          </Navbar.Collapse>          
        </Container>
      </Navbar>
    </header>
  )
}

export default Header