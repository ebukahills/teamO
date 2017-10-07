import React from 'react';

import { Row, Col, Navbar, NavbarBrand, Container } from 'reactstrap';

export default ({ children }) => {
  return (
    <Container fluid>
      <Row
        style={{
          zIndex: 999,
          backgroundColor: '#fff',
          borderBottom: '2px solid #dedede',
          boxShadow: '#000',
        }}
      >
        <Navbar color="faded" light expand="md">
          <NavbarBrand>
            <h1>teamO!</h1>
          </NavbarBrand>
        </Navbar>
      </Row>
      <Row
        className="justify-content-center align-middle"
        style={{ backgroundColor: '#f7f7f7', minHeight: '90vh' }}
      >
        <Col xs="10" sm="6" md="6" className="align-self-center">
          {children}
        </Col>
      </Row>
    </Container>
  );
};
