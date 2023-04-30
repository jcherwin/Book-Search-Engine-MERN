import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query user($username: String!) {
    user(username: $username) {
        _id
        username
        email
        thoughts {
            _id
            thoughtText
            createdAt
        }
    }
}
`;

export const GET_ME = gql`
query me {
    me {
        _id
        username
        email
        password
        savedBooks {
            _id
            authors
            description
            bookId
            image
            link
            title
        }
    }
}
`;
