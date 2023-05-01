import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
    const { loading, data } = useQuery(GET_ME, {
        fetchPolicy: 'network-only', // Used for first execution
        nextFetchPolicy: 'cache-first', // Used for subsequent executions
    });

    const [removeBook] = useMutation(REMOVE_BOOK, {
        refetchQueries: [
            { query: GET_ME },
            'Me'
        ],
    });    

    if (!data?.me) {
        return (
          <h4>  <br/><br/> 
            You need to be logged in to use this. <br/><br/> 
            Use the navigation links above to sign up or log in!
          </h4>
        );
    }

    const userData = data?.me;

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = (bookId) => {
        try {
            removeBook({
                variables: { bookId: bookId },
            });
            // upon success, remove book's id from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div fluid="true" className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            {loading ? (
                <h2>LOADING...</h2>
            ) : (
                <Container>
                    <h2 className='pt-5'>
                        {userData.savedBooks.length
                            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                            : 'You have no saved books!'}
                    </h2>
                    <Row>
                        {userData.savedBooks.map((book) => {
                            return (
                                <Col md="4" key={book.bookId}>
                                    <Card key={book.bookId} border='dark'>
                                        {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                        <Card.Body>
                                            <Card.Title>{book.title}</Card.Title>
                                            <p className='small'>Authors: {book.authors}</p>
                                            <Card.Text>{book.description}</Card.Text>
                                            <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                                                Delete this Book!
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            )}
        </>
    );
};

export default SavedBooks;
