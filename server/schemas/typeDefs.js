const { gql } = require('apollo-server-express');

// declare the typedefs for User, Book, auth, mutations, queries
const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }
    input bookInfo {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    type Auth {
        token: ID!
        user: User
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