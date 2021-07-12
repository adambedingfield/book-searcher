const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User} = require('../models');

const resolvers = {
    Query: {
        // queries users saved books
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                                    .select('-__v -password')
                                    .populate('books')
                return userData;
            }
            throw new AuthenticationError('Not logged in.')
        }
    },

    Mutation: {
        // adds new users with token
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token  = signToken(user)
            return { token, user}
        },
        // login user on correct info input
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            // return error on no user
            if (!user) {
                throw new AuthenticationError("No user found.");
            }
            // return error on fail
            const correctPw = await user.isCorrectPassword(password)
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials.')
            }

            const token = signToken(user);
            return {token, user};
        },

        // saves users books
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                // when user saves book, updates to show it
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData}},
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in.')
        },
        // removes saved book from savelist
        deleteBook: async (parent, { bookId }, context) => {
            // when user deletes book, updates to show it
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId} }},
                    { new: true }
                )
                return updatedUser
            }
            throw new AuthenticationError('Not logged in.')
        }
    }
}

module.exports = resolvers;