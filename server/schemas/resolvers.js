const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (parent, { username }) => {
            return User.findOne({ username });
        },
        me: async (parent, args, context) => {
            console.log(args);
            console.log(context.user);
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            console.log(args);
            console.log(context.user);
            // try {
            //     const updatedUser = await User.findOneAndUpdate(
            //         { _id: user._id },
            //         { $addToSet: { savedBooks: body } },
            //         { new: true, runValidators: true }
            //     );
            //     return res.json(updatedUser);
            // } catch (err) {
            //     console.log(err);
            //     return res.status(400).json(err);
            // }
        },
    },
};

module.exports = resolvers;
