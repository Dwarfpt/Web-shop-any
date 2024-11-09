// frontend/src/pages/Catalog.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Catalog = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Товар 1</Card.Title>
                            <Card.Text>
                                Краткое описание товара 1.
                            </Card.Text>
                            <Card.Link href="#">Подробнее</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Товар 2</Card.Title>
                            <Card.Text>
                                Краткое описание товара 2.
                            </Card.Text>
                            <Card.Link href="#">Подробнее</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Товар 3</Card.Title>
                            <Card.Text>
                                Краткое описание товара 3.
                            </Card.Text>
                            <Card.Link href="#">Подробнее</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Добавьте больше карточек товаров по необходимости */}
            </Row>
        </Container>
    );
};

export default Catalog;
