const { User, Book } = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        // 
        me: async (parent, args, context) => {
            // only need to query logged in user to bring up their booklist
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                                    .select('-__v -password')
                                    .populate('books')
                return userData;
            }

            throw new AuthenticationError('You need to log in!')
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token  = signToken(user)
            return { token, user}
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            // case of no user found
            if (!user) {
                throw new AuthenticationError("No user with that email!");
            }

            // check password
            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw) {
                throw new AuthenticationError('Your password or email may be wrong')
            }

            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {

                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData}},
                    { new: true }
                )

                return updatedUser
            }

            throw new AuthenticationError('You need to log in!')
        },
        // remove book from user's book list
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId} }},
                    { new: true }
                )
                return updatedUser
            }

            throw new AuthenticationError('You need to log in!')
        }
    }
}

module.exports = resolvers