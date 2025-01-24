import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import useragent from 'useragent';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import mongomock from './mongomock.js'
import User from './Schemas/Users.js';
import Game from './Schemas/Games.js';
import Comment from './Schemas/Comments.js';
import Token from './Schemas/Tokens.js';


// async function mongooseConnect () {
//     // Connexion à la base de données MongoDB
//     await mongoose.connect('mongodb://localhost:27017/test', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }).then(() => {
//         console.log("Connected to MongoDB");
//     }).catch((err) => {
//         console.log("Failed to connect to MongoDB", err);
//     });
// }

// mongooseConnect();

export const checkIfEmailIsValid = (email) => {
    if (!email) throw new ReferenceError("Missing argument.");
    if (typeof email !== "string") throw new TypeError("Argument has wrong type.");

    const emailRegex = /^(?=.{1,100}$)(?=.{1,64}@)[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,62}@[a-zA-Z0-9-]{1,35}\.[a-zA-Z]{2,6}$/;

    try {
        return emailRegex.test(email);
    } catch(e) {
        throw e;
    }
}

export const checkIfUserNameIsValid = (username) => {
    if (!username) throw new ReferenceError("Missing argument.");
    if (typeof username !== "string") throw new TypeError("Argument has wrong type.");

    const usernameRegex = /^(?=.{7,35}$)(?!.*--)(?!.*([a-zA-Z])\1\1)[a-zA-Z0-9](?!.*-$)[a-zA-Z0-9-]*[a-zA-Z0-9]$/;

    try {
        return usernameRegex.test(username);
    } catch(e) {
        throw e;
    }
}

export const checkIfPassIsValid = (password) => {
    if (!password) throw new ReferenceError("Missing argument.");
    if (typeof password !== "string") throw new TypeError("Argument has wrong type.");

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\s])((?!\s\s).){8,128}$/;

    try {
        return passRegex.test(password);
    } catch(e) {
        throw e;
    }

}

export const hashPassword = async (password) => {
    if (!password) throw new ReferenceError("Missing argument.");
    if (typeof password !== "string") throw new TypeError("Argument has wrong type.");

    try{
        const saltRounds=10; // Nb de tours pour gen le sel (plus il est élévé, plus c'est sécurisé).
        const hashPassword = await bcrypt.hash(password, saltRounds);
        return hashPassword

    } catch(e){
        return e;
    }
    
}

// Configuration du transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER, // Mail
//         pass: process.env.EMAIL_PASS, // MDP d'application
//     }
// });

// export const sendRecoveryMail = async (to, text) => {
//     if (!to || !text) throw new ReferenceError('Arguments missing.');
//     if (typeof to !== "string" || typeof text !== "string") throw new Error('The arguments must be string.');

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to, 
//         subject:"MangaVerse procédure de récupération de mot de passe.",
//         text,
//     };

//     return await transporter.sendMail(mailOptions);
// }

export async function addGameToList(user_id, game_id) {
    if (!user_id) {
        throw new Error("The property user_id of the object req.user has not been specified.");
    }

    if (!game_id) {
        throw new Error("No game_id specified.");
    }

    if (typeof game_id != "number" || typeof user_id !== "number") {
        throw new Error("Arguments must be number.");
    }
   
    try {
        // Check if the user and the game exist in the database
        // If the user or the game doesn't exist, throw an exception
        const game = await Game.findOne({ _id: game_id});
        if (!game) {
            throw new Error("The game has not been found.");
        }

        const user = await mongomock.findUser(user_id);
        if (!user) {
            throw new Error("The user has not been found.");
        }

        // Check if the game is already in the user's list
        const isAlreadyInList = user.game_list.includes(game_id);

        if (isAlreadyInList) {
            throw new Error("The game is already in the user's list.");
        }

       // Add the game to the user's list
       return await User.updateOne({ user_id: user_id }, { $push: { game_list: game_id } });
        
    } catch(e) {
        throw e;
    }
}


export async function searchGame(filters,page_number) {

    if (!filters) throw new ReferenceError('Missing argument.');
    if (typeof filters != "object") throw new TypeError('filters argument must be a objet.');

    const checkedFilters = {}; // Filter who will be used.

   try {
        Object.entries(filters).forEach(([key,value]) =>{
            if(value) checkedFilters[key] = value; // Add the filter if he's defined
        });


        if (Object.keys(filters).length === 0) throw new ReferenceError("No filters have been specified.");

        return await mongomock.findGames(checkedFilters,page_number || 1);
   } catch(e) {
        throw e;
   }

}


export async function getUserGameList(user_id) {
    // If no user_id is provided, throw an error
    if (!user_id) {
        throw new Error("The user_id has not been specified.");
    }

    if (typeof user_id !== "number") {
        throw new Error("Wrong type argument.");
    }

    try {
         // Get the user from the database
        const user = await mongomock.findUser(user_id);
        
        // If the user does not exist, throw an error
        if (!user) {
            throw new Error("Your request could not be processed, please check again.");
        }

        // Get the user's game list from the database
        const gameList = await mongomock.userGameList(user_id);

        // Return the game list along with any other additional information
        return gameList;

    } catch(e) {
        throw e;
    }
}

export async function addUser(user_email, user_pass, user_username) {
    if (!user_email || !user_pass || !user_username) throw new Error("missing arguments.");
    if (typeof user_email !== "string" || typeof user_pass !== "string" || typeof user_username !== "string") throw new Error("Wrong type arguments.");

    try {

        // Check if email / pass / username are valid.
        if (!checkIfEmailIsValid(user_email)) throw new Error('Invalid email.');
        if (!checkIfPassIsValid(user_pass)) throw new Error('Invalid password.');
        if (!checkIfUserNameIsValid(user_username)) throw new Error('Invalid username.');

        // Check if email or  username is already taken.
        const  existingUser = "";
        if (existingUser) throw new Error('Email or username already taken.');

        const hashPass= await hashPassword(user_pass);

        const response = await mongomock.addUser({"email":user_email, "pass":hashPass, "username":user_username,"Game_list":[],"profile_picture":""});
        return response
    } catch (e) {
        throw e;
    }
}

export async function delUser(user_id, attempt_pass) {
    // Validate the input parameters
   try {
        if (!user_id) {
            throw new Error("No user id specified.");
        }
        if (!attempt_pass) {
            throw new Error("No password specified.");
        }
        if (attempt_pass.length > 128) {
            throw new Error("The information provided is incorrect.");
        }

        // Retrieve the user from the database
        const user = await mongomock.findUser(user_id);
        if (!user) {
            throw new Error("No user has been found.");
        }

        // Compare the provided password with the stored password
        const isSamePassword = await bcrypt.compare(attempt_pass, user.user_pass);
        if (!isSamePassword) {
            throw new Error("The information provided is incorrect.");
        }

        // Delete the user from the database
        return await mongomock.delUser(user_id);
   } catch(e) {
        throw e;
   }
}


export async function processLogin(user_email, user_pass, req) {
    if (!user_pass) {
        throw new Error("No password has been specified.");
    }

    try {
        const user = await mongomock.findUser(user_email);
        if (!user) {
            throw new Error("The data entered did not allow you to be authenticated.");
        }

        const isMatch = await bcrypt.compare(user_pass, user.pass);
        if (!isMatch) {
            throw new Error("The data entered did not allow you to be authenticated.");
        }

        const accessToken = jwt.sign(
            {
                user_id: user.user_id,
                user_email: user.user_email,
                photoprofil: user.photoprofil,
            },
            process.env.ACCES_JWT_SECRET,
            { expiresIn: '15m', algorithm: 'HS256' }
        );

        const refreshToken = jwt.sign({}, process.env.REFRESH_JWT_SECRET, {
            expiresIn: '5d',
            algorithm: 'HS256',
        });

        // await TokensCollection.create({
    //     token: accessToken,
    //     type: 'access',
    //     userId: new mongoose.Types.ObjectId(user.user_id),
    //     createdAt: new Date().toISOString(),
    //     expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    //     ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    //     deviceInfo: agent.device,
    // });

    // await TokensCollection.create({
    //     token: refreshToken,
    //     type: 'refresh',
    //     userId: new mongoose.Types.ObjectId(user.user_id),
    //     createdAt: new Date().toISOString(),
    //     expiredAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    //     ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    //     deviceInfo: agent.device,
    // });


        return { accessToken, refreshToken };
    } catch(e) {
        throw e;
    }
  
}

export async function logoutProcess(refreshToken, accessToken, req) {
    if (!refreshToken || !accessToken) throw new ReferenceError('Both refreshToken and accessToken are required.');
    if(typeof refreshToken !== "string" || typeof accessToken !== "string") throw new TypeError('Wrong type arguments.');

    if (!req.headers['user-agent']) throw new Error("User-Agent header is missing.");
      
        const user = req.user;
        const agent = useragent.parse(req.headers['user-agent']);

        await mongomock.addToken('access', {
            token: accessToken,
            userId: user.user_id,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            deviceInfo: agent.device,
            isRevoked: false,
            revokedAt: null,
          });
        
         
          await mongomock.addToken('refresh', {
            token: refreshToken,
            userId:  user.user_id,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Expires in 5 days
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            deviceInfo: agent.device,
            isRevoked: false,
            revokedAt: null,
          });
    
    // have to return InsertMany value
    return { message: 'Successful disconnection', removeAccessToken: true };
}

export async function fetchGameComments(game_id, page_number) {
    // Vérification que les paramètres sont définis
    if (!game_id) {
        throw new Error("Game Id not specified.");
    }

    if (!page_number) {
        throw new Error("Page number not specified.");
    }

    try {
        // Vérification que le jeu existe
        const gameExists = await mongomock.findGames({game_id}, 1);
        if (!gameExists) {
            throw new Error(`Game not found.`);
        }

        const comments = await mongomock.fetchGameComments(game_id, page_number);

        return comments;
    } catch (e) {
        throw e;
    }
}

export async function addComment(user_id, comment_content, game_id, parent_id) {
    try {
        // Verifying the user's existence
        const user = await mongomock.findUser(user_id);
        if (!user) {
            throw new Error('User not found.');
        }

        // Verifying the game's existence
        const game = await mongomock.findGames({game_id}, 1);
        if (!game) {
            throw new Error('Game not found.');
        }

        // Create a new comment
        const newComment = {
            user_id,
            comment_content,
            game_id,
            parent_id,
        };

        // Save it in the bd
        const response = await mongomock.addComments(newComment);

        // Return the response
        return response;
    } catch(e) {
        throw e;
    }
}

export async function addCommentLike(user_id, game_id, comment_id) {

    if (!user_id || !game_id || !comment_id) {
        throw new ReferenceError("arguments missing.");
    }

    try {
        // Check if the user exists in the database
        const user = await mongomock.findUser(user_id);
        if (!user) {
            throw new ReferenceError("User not found.");
        }

        // Check if the game exists in the database
        const game = await mongomock.findGames({game_id}, 1);
        if (!game) {
            throw new Error("Game not found.");
        }

        // Check if the comment exists and belongs to the specified game
        let i = 1;
        let commentIsInGame = false;

        while (true) {
            const commentsPage = await mongomock.fetchGameComments(game_id,i);

            if (commentsPage.length === 0) {
                break;
            }

            const comment = commentsPage.some(comment => comment.comment_id === comment_id);

            if (comment) {
                commentIsInGame = true;
                break;
            }
            
            i++
        }

        if (!commentIsInGame) {
            throw new Error("Comment not found or does not belong to the specified game.");
        }

        // Check if the comment has already been liked by this user
        
    

        const response = await mongomock.addCommentLike(user_id, game_id, comment_id);

        // Return the result 
        return response ;
    } catch(e) {
        throw e;
    }
}

export async function delComment(user_id, game_id, comment_id) {

    if (!user_id || !game_id || !comment_id) throw new Error("Arguments missing.");

    // Check if the user exists in the database
    const user = await mongomock.findUser(user_id);
    if (!user) {
        throw new Error("Resource not found.");
    }

    // Check if the game exists in the database
    const game = await mongomock.findGames({game_id}, 1);
    if (!game) {
        throw new Error("Game not found.");
    }

    // Fetch all comments of the game and verify the comment exists
    let i = 1;
    let commentIsInGame = false;

    while (true) {
        const commentsPage = await mongomock.fetchGameComments(game_id,i);

        if (commentsPage.length === 0) {
            break;
        }

        const comment = commentsPage.some(comment => comment.comment_id === comment_id);

        if (comment) {
            commentIsInGame = true;
            break;
        }
        
        i++
    }

    // If the comment does not exist, throw an error
    if (!commentIsInGame) {
        throw new Error("Comment not found.");
    }

    // Delete the comment from the database
    const response = await mongomock.delComment(comment_id);
   
    // Return a success response
    return response;
}

export async function unlikeComment(user_id, game_id, comment_id) {
    if (!user_id || !game_id || !comment_id) throw new ReferenceError("Arguments missing.")

    // Verify if the user exists in the database
    const user = await mongomock.findUser(user_id);
    if (!user) {
        throw new Error("User not found.");
    }

    // Verify if the game exists in the database
    const game = await mongomock.findGames({game_id}, 1);
    if (!game) {
        throw new Error("Game not found.");
    }

    // Verify if the comment exists and belongs to the specified game
   
    let i = 1;
    let commentIsInGame = false;

    while (true) {
        const commentsPage = await mongomock.fetchGameComments(game_id,i);

        if (commentsPage.length === 0) {
            break;
        }

        const comment = commentsPage.some(comment => comment.comment_id === comment_id);

        if (comment) {
            commentIsInGame = true;
            break;
        }
        
        i++
    }

    // If the comment does not exist, throw an error
    if (!commentIsInGame) {
        throw new Error("Comment not found.");
    }

    // Verify if the user has liked this comment
   


    const response = mongomock.deleteCommentLike(user_id, game_id, comment_id); 

    // Return a success response
    return response;
}

export async function changePassword  (user_email, new_password) {
    if (!user_email || !new_password) throw new Error("Arguments missing.");

    try {
        // Search the user in the database
        const user = await mongomock.findUser(user_email);
        if (!user) {
            throw  new Error("No user was found with the specified email address.");
        }

        // Check the compliance of the password
        if (!checkIfPassIsValid(new_password)) {
            throw new Error("The password must contain at least 8 characters, 1 uppercase letter, and one special character.");
        }

        // Check if the new password is different from the old one
        const isSamePassword = await bcrypt.compare(new_password, user.pass);
        if (isSamePassword) {
            throw  new Error("The new password must be different from the old one.");
        }

        // Hash the new password
        const hashedPassword = await hashPassword(new_password);

        // Update the user's password in the database
        await mongomock.changePassword(user.user_id, hashedPassword);
        
        return "The password has been changed successfully.";
    } catch (e) {
        throw e;
    }
};

export async function fetchTenMostAddedGames() {
    try {
        const response = await mongomock.tenMostAddedGames();
        return response;
    } catch (e) {
        throw e;
    }
};

export async function fetchTopRatedGamesByGenre(genre) {
    if (!genre) throw new ReferenceError('Genre argument missing.');
    if (typeof genre !== "string") throw new TypeError('Genre argument has wrong type.');

    try {
        const response = await mongomock.topRatedGameByGenre(genre);
        console.log(response)
        return response;

    } catch (e) {
        throw e;
    }
};
console.log(fetchTopRatedGamesByGenre("Platform"))

export async function fetchMostRecentGames(game_type = "any", page_number = 1) {
    try {
        const response = await mongomock.mostRecentGame(game_type, page_number);
        return response;
    } catch (e) {
        throw e;
    }
};

export async function sendPasswordRecoveryEmail(user_email, res) {
    if (!user_email) {
        throw Error("Email argument is missing.");
    }

    try {

        // Search the user in the bd
        const user = await mongomock.findUser(user_email);
        if (!user) {
            throw new Error("Your request could not be processed, please try again");
        }

        // Create cookie data
        const cookieData = {
            recovery_token: crypto.lib.WordArray.random(32).toString(crypto.enc.Hex),
            user_id: user.user_id,
            user_email: user.user_email,
        };

        // Configue the cookie
        res.cookie('recovery_cookie', JSON.stringify(cookieData), {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            signed: true, // Sign the cookie
        });

        // Create the recovery mail
        const resetLink = `https://5001/reset-password?token=${cookieData.recovery_token}`;
        const text = `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`;

        // Send mail
        // await sendRecoveryMail(user.user_email, text);

        return "Recovery mail has been sended.";
    } catch (e) {
        throw e;
    }
};