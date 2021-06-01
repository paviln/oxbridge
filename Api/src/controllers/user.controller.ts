import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getJwtSecret } from '../config/config';
import User, { IUser } from '../models/user';
import EmailForgotPassword from '../email/email.forgotPassword';


// Retrieve and return all users from the database.
const findAll = (req: Request, res: Response) => {
    // Finding all users
    User.find({}, { _id: 0, __v: 0 }, null, function (err, users) {
        if (err)
            return res.status(500).send({ message: err.message || "Some error occurred while retriving users" });

        res.status(200).json(users);
    });
};

// Find a single user with the specified emailUsername
const findOne = (req: Request, res: Response) => {
    // Finding the user with the given userId
    User.findOne({ emailUsername: req.params.emailUsername }, { _id: 0, __v: 0 }, null, function (err, user) {
        if (err)
            return res.status(500).send({ message: "Error retrieving user with userName " + req.params.emailUsername });
        if (!user)
            return res.status(404).send({ message: "User not found with userName " + req.params.emailUsername });

        res.status(200).send(user);
    });
};

// Update a user with the specified emailUsername
const update = (req: any, res: Response) => {
    // Updating the user
    var hashedPassword = bcrypt.hashSync(req.body.password, 10);
    var newUser = new User(req.body);
    newUser.password = hashedPassword;
    newUser.role = req.user.role;

    User.findOneAndUpdate({ emailUsername: newUser.emailUsername }, newUser, null, function (err, user) {
        if (err)
            res.send(err);
        if (!user)
            return res.status(404).send({ message: "User not found with id " + req.params.emailUsername });

        res.status(202).json(user);
    });
};

// Delete a user with the specified emailUsername
const remove = (req: any, res: any) => {
    // Deleting the user with the given userId
    User.findOneAndDelete({ emailUsername: req.params.emailUsername }, null, function (err, user) {
        if (err)
            res.send(err);
        if (!user)
            return res.status(404).send({ message: "User not found with id " + req.params.emailUsername });

        res.status(202).json(user);
    });
};

// Register a new admin user and return token
const registerAdmin = (req: Request, res: Response) => {
    // Checking that no other user with that username exists
    User.find({ emailUsername: req.body.emailUsername }, function (err, users) {
        if (err)
            return res.status(500).send({ message: err.message || "Some error occurred while retriving users" });
        console.log(users);
        if (users.length > 0)
            return res.status(409).send({ message: "User with that username already exists" });

        var user = new User(req.body);
        user.role = "admin";

        user.save(function (err) {
            if (err)
                return res.status(500).send("There was a problem registrating the user");

            var token = jwt.sign({ id: user.emailUsername, role: "admin" }, getJwtSecret(), { expiresIn: 86400 });
            res.status(201).send({ auth: true, token: token });
        });
    });
    //});
};

// Register a new user and return token
const register = (req: Request, res: Response) => {

    // Checking that no user with that username exists
    User.findOne({ emailUsername: req.body.emailUsername }, null, null, function (err, user) {
        if (err)
            return res.status(500).send({ message: err.message || "Some error occurred while retriving users" });

        if (user)
            return res.status(409).send({ message: "User with that username already exists" });

        // Creating the user
        var user: IUser | null = new User(req.body);
        user.role = "user";

        user.save(function (err) {
            if (err)
                return res.status(500).send("There was a problem registrating the user");

            // returning a token
            var token = jwt.sign({ id: user.emailUsername, role: "user" }, getJwtSecret(), { expiresIn: 86400 });
            res.status(201).send({ auth: true, token: token });
        });
    });
};

// Check login info and return login status
const login = (req: Request, res: Response) => {

    // Find the user and validate the password
    User.findOne({ emailUsername: req.body.emailUsername }, null, null, function (err, user) {
        if (err)
            return res.status(500).send('Error on the server');
        if (!user)
            return res.status(403).json('Username incorrect');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(401).send({ auth: false, token: null, message: "Invalid password" });

        var token = jwt.sign({ id: user.emailUsername, role: user.role }, getJwtSecret(), { expiresIn: 86400 });
        res.status(200).send({ emailUsername: user.emailUsername, firstname: user.firstname, lastname: user.lastname, auth: true, token: token });
    });
};

const forgotPassword = async (req: Request, res: Response) => {
    const user = await User.findOne({emailUsername: req.body.emailUsername});
    if(!user) throw new Error("user not found");

    user.password = '1234';
    new EmailForgotPassword(user.emailUsername, user.password);
    await user.save();

    res.status(200).send(user);
}

export default {
    findAll,
    findOne,
    update,
    remove,
    registerAdmin,
    register,
    login,
    forgotPassword
}