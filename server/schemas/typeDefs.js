const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: ID!
        description: String
        title: String!
        image: String
        link: String
        authors: [String]
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    input bookInfo {
        authors: [String]
        description: String
        image: String
        link: String
        bookId: ID!
        title: String
    }

    type Query {
        me: User
    }    

    type Mutation {
        login (email: String!, password: String!): Auth
        addUser (username: String!, email: String!, password: String): Auth
        saveBook (bookData: bookInfo!): User
        deleteBook (bookId: ID!): User
    }
`;

module.exports = typeDefs;