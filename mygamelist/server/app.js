import express from 'express';
import cors from 'cors';
// import mongoose, { mongo } from 'mongoose';
import * as utils from './app_functions.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 






// mongoose.connect("mongodb://127.0.0.1:27017/gameverse", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Successfully connected to MongoDB!"))
//   .catch(err => console.error("Connection error to MongoDB:", err));

//   const tokenSchema = new mongoose.Schema({
//     token: { type: String, required: true },
//     type: { type: String, enum: ['access', 'refresh'], required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     createdAt: { type: Date, default: Date.now },
//     expiredAt: { type: Date },
//     isRevoked: { type: Boolean, default: false },
//     revokedAt: { type: Date, default: null },
//     ipAddress: { type: String },
//     deviceInfo: { type: String },
//   });
  
//   const TokensCollection = mongoose.model('Tokens', tokenSchema);

const app = express();

//  Load the environment file containing the secret keys.
dotenv.config({ path: '/home/rds/Desktop/rebirth/mygamelist/server/secret_keys.env' }); // Didn't work with a relative path, so you'll have to adapt it to your system.

app.use(express.json()); // to analyze JSON queries.

// Configuration Cors
const corsOptions = {
    origin: 'http://localhost:3000', // L'origine exacte à autoriser.
    credentials: true, // Autorise l'envoi des cookies et des credentials.
    allowedHeaders:['Content-Type', 'Authorization'] //En-têtes autorisés.
  };

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // Facilite l'accès aux cookies.

// JWT Config
const options = {
    expiresIn: '15m',  // Expiration du token (15 minutes).
    algorithm: 'HS256'      // L'algorithme de signature à utiliser (ici HMAC avec SHA-256).
    
};

// Check the validity of the accessToken
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for the presence of the Authorization header.
    if (!authHeader){
        return res.status(401).json({ message: `Unauthorized: The request does not contain an Authorization header.` }); // Returns a response with a 401 status and a non-authorization message.
    }

    // Extract the accesToken.
    const accessToken = authHeader.split(' ')[1];

    try {
        // Check and decoded the accesToken
        const decoded_data = jwt.verify(accessToken, process.env.ACCES_JWT_SECRET);
        
        // Add the user's datas in the request
        req.user =  decoded_data;
        next(); // Goes to the next middleware or route.
    } catch (e) {
        if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
            return refreshAccesToken(req, res, next); // Call the refreshing middleware.
        } else {
            return res.status(401).json({ message: 'invalid Token', redirectUrl: '/login'});
        }
    }
    
    
}

const refreshAccesToken = (req, res, next) => {
    const refreshToken = req.signedCookies.refreshToken;
    
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({message:'Invalid refreshToken',redirectUrl: '/login'});  
            } else {
                const newAccessToken = jwt.sign({
                    ...req.user, // Retrieve data from the old accessToken.

                }, process.env.ACCES_JWT_SECRET, options);

                req.newAccesToken = newAccessToken;
            }
        });
        next();
    } else {
        res.status(401).json({ message:'Refresh Token missing.' ,redirectUrl: '/login', removeAccessToken:true}); 
    }
}

const checkIfTokenRevoked = async (req, res, next) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    const refreshToken = req.signedCookies.refreshToken;

    // if (accessToken && refreshToken) {
    //     try {
    //         const accessTokenIsRevoked = await TokensCollection.findOne({token: accessToken, isRevoked: true});
    //         const refreshTokenIsRevoked = await TokensCollection.findOne({token: refreshToken, isRevoked: true});

    //         if (accessTokenIsRevoked || refreshTokenIsRevoked) {
    //             return res.status(401).json({message:`Unauthorized: acces or refresh token are revoked.`});
    //         }

    //         next();
    //     } catch(e) {
    //         return res.status(500).json({message:`problem encountered during operation.`});
    //     }
        
    // } else {
    //     return res.status(401).json({message:`Unauthorized: one or several tokens token are missing .`});
    // }

}

// const authRequiredRoutes = ['/mygamelist', '/profile', '/settings'];                                    Probablement plus utilisé

// const checkAuthorization = (req, res, next) => {
//     if (authRequiredRoutes.includes(req.originalUrl) && !req.user) {
//         return res.status(401).json({ message: 'Unauthorized: accès interdit.' });
//     }
//     next();
// }

const checkCommentCompliance = (req, res, next) => {
    const comment = req.body.comment_content;

    // Check that the comment_content parameter has been specified
    if (!comment) return res.status(400).json({ message: 'No comment specified.', status: 400, timestamp: new Date().toString() });

    // Check that the comment does not exceed 1000 characters
    if (comment.length > 1000) return res.status(400).json({ message: 'The comment exceed thousand characters.', status: 400, timestamp: new Date().toString() });

    // Check that the comment is not an forbidden word (Collection of banwords ?)

    next(); // Go to the next path
}


const checkIfNewAccessToken = (req) => {
    if (req.newAccesToken) {
        return {newAccessToken: req.newAccesToken}
    }
}


app.get('/search_game', async (req,res)=>{
    const {title, platforms, genres, developers, publishers, game_modes, themes} = req.query;

    const game_id = Number(req.query.game_id);
    const page_number = Number(req.query.page_number) || 1;
    

    const params_to_verify = { title, game_id, platforms, genres, developers, publishers, game_modes, themes }; // Filtres à vérifier.

    try {
        const games = await utils.searchGame(params_to_verify, page_number);
        res.json({data:games});
        
    } catch (e) {

        let statusValue;
        switch(true){
            case (e instanceof TypeError) || (e instanceof ReferenceError):
                statusValue=400;
                break;
            case(e.message === `Aucune données n'a été trouvé pour la requête saisie.` ):
                statusValue=404;
                break;
            default:
                statusValue=500;
        }

        res.status(statusValue).json({message:e.message, status:e.status, timestamp:e.timestamp});
    }
        
    
        
 

});

app.get('/gamelist/:user_id?', verifyToken, checkIfTokenRevoked, async (req, res) => {
    let user_id = Number(req.params.user_id);  // Retrieving user_id from the route parameters

    // If user_id is not provided in the parameters, use the user_id from the token
    if (!user_id) user_id = req.user.user_id;

    try {
        // Call the getUserGameList function
        const userGameList = await utils.getUserGameList(user_id);   

        // Send the response back with the game list
        res.status(200).json({data: userGameList, ...checkIfNewAccessToken(req)});

    } catch (e) {
        // Determine the appropriate status code based on the error
        let statusValue;

        if (e instanceof TypeError || e instanceof ReferenceError) {
            statusValue = 400;
        } else if (e.message === `No games found for this user.` || e.message === 'Your request could not be processed, please check again.') {
            statusValue = 404;
        } else {
            statusValue = 500;
        }

        // Send the error response
        res.status(statusValue).json({
            message: e.message,
            status: e.status,
            timestamp: e.timestamp,
        });
    }

});

app.post('/add_user', async (req,res)=>{

    const {user_email, user_username, user_pass} = req.body;

    if(!user_email || !user_username || !user_pass) return res.status(400).json({message:`One or more parameters are missing.`, status:400, timestamp: new Date().toString()});

    try {
       
        const response = await utils.addUser(user_email, user_pass, user_username);

        // Have to send verification mail


        res.json({data:response});

    } catch(e) {
        let statusValue;

        if (e.message === 'Email or username already taken.'){
            statusValue=409;
        }
        else if (e.message === "missing arguments." || e.message === "Wrong type arguments." || e.message.includes("Invalid")){
            statusValue=400;
        }
        else{
            statusValue=500;
        }

        res.status(statusValue).json({message:e.message, status:e.status, timestamp:e.timestamp});
    }

    

});

app.post('/del_user', verifyToken, checkIfTokenRevoked, async (req, res) => {
    const user_id = Number(req.user.user_id);
    const attempt_pass = req.user_pass;

    if (!user_id) return res.status(400).json({message: 'No user id specified.', status: 400, timestamp: new Date().toString()});
    if (!attempt_pass) return res.status(400).json({message: 'No password specified.', status: 400, timestamp: new Date().toString()});
    if (attempt_pass.length > 128) return res.status(400).json({message: 'The information provided is incorrect.', status: 400, timestamp: new Date().toString()});

    try {
        // Call the delUser function to delete the user
        const response = await utils.delUser(user_id, attempt_pass);

        // Send a successful response
        res.status(200).json({data:response});
    } catch (e) {
        // Determine the appropriate status code
        let statusValue;

        if (e.message.includes("specified") || e.message === "The information provided is incorrect.") {
            statusValue = 400;
        } else if (e.message.includes("found")) {
            statusValue = 404;
        } else {
            statusValue = 500;
        }

        // Send the error response
        res.status(statusValue).json({
            message: e.message,
            status: e.status,
            timestamp: e.timestamp,
        });
    }
})

app.get('/login', (req, res) => {
    // Si l'utilisateur est déjà connecté, redirige-le ailleurs
    if(req.signedCookies.refreshToken) {
        
       return res.status(200).json({redirectUrl: '/'});
      
    }
    /** if(req.user) {
        const accessToken = req.headers.authorization.split(" ")[1];
        if (accessToken) {
            return res.status(200).json({redirectUrl: '/'});
        }
    } */

    if (req.newAccesToken) {
        return res.status(200).json({newAccessToken: req.newAccesToken || null, redirectUrl: '/'})
    }
    
    res.status(200);
    
  });

  app.post('/login_process', async (req, res) => {
    const { user_email, user_pass } = req.body;

    try {
        const { accessToken, refreshToken } = await utils.processLogin(user_email, user_pass, req);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // The cookie will not be accessible from JS
            secure: false,   // The cookie will be only send with HTTPS protocol
            sameSite: 'Lax',    // accept only cookies who are from same domain
            maxAge: 5 * 24 * 60 * 60 * 1000,
            signed: true,
        });

        return res.status(200).json({ data:accessToken });
    } catch (e) {
        let status = e.status || 500;

        if(e.message.includes("specified")) status = 400;
        
        return res.status(status).json({
            message: e.message || 'Internal server error',
            status,
            timestamp: new Date().toISOString(),
        });
    }
});


app.post('/logout', verifyToken, async (req,res) => {
    const refreshToken = req.signedCookies.refreshToken;
    const accessToken = req.headers.authorization.split(' ')[1];

    try {
        const response = await utils.logoutProcess(refreshToken, accessToken, req);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            signed: true,
        });

        res.status(200).json({data:response, redirectUrl: "/", removeAccessToken: true});
    } catch (e) {
        res.status(500).json({ message: e.message || 'Internal server error', status: 500 });
    }
});

app.get('/fetch_game_comments', async (req,res)=>{
    const game_id = Number(req.query.game_id);
    const page_number = Number(req.query.page_number || 1);
    
    try {
        const promise_response = await utils.fetchGameComments(game_id, page_number);
        res.json(promise_response);
    } catch (e) {
        let statusValue;

        if (e instanceof ReferenceError) {
            statusValue = 400;
        } else if (e.message === `Le jeu d'id (${game_id}) n'a pas été trouvé dans la bd.`) {
            statusValue = 401;
        } else {
            statusValue = 500;
        }

        res.status(statusValue).json({
            message: e.message,
            status: e.status,
            timestamp: e.timestamp,
        });
    }

});

app.post('/add_comment', verifyToken, checkCommentCompliance, async (req,res)=>{
    const user_id = req.user.user_id;
    const comment_content = String(req.body.comment_content);
    const game_id=Number(req.body.game_id);
    const parent_id = Number(req.body.parent_id) || 0; // 0 if parent_id is undefined.

    try {
        const response = await utils.addComment(user_id, comment_content, game_id, parent_id);
        res.json(response);
    } catch (e) {
        let statusValue = 500;

        if (e instanceof ReferenceError) {
            statusValue = 400;
        } 
        else if(e.message.includes("found")) {
            statusValue = 404;
        }

        res.status(statusValue).json({
            message: e.message,
            status: e.status,
            timestamp: e.timestamp,
        });
    }
    
});


app.post('/del_comment', verifyToken, checkIfTokenRevoked, async (req,res)=>{
    const user_id = req.user.user_id;
    const comment_id = Number(req.body.comment_id);
    const game_id=Number(req.body.game_id);

    if (!user_id || !comment_id || !game_id) return  res.status(400).json({message: "Some arguments are missing.", status:400, timestamp: new Date().toString()});

    try {
        const response = await utils.delComment(user_id, game_id, comment_id);
        return res.status(200).json({data:response, ...checkIfNewAccessToken(req)});
    } catch (e) {
        let status = e.status || 500;

        if (e.message.includes("not found")) status = 404;
        return res.status(status).json({
            message: e.message,
            status: status,
            timestamp: new Date().toString(),
        });
    }
    
});

app.post('/add_game_to_list', verifyToken, checkIfTokenRevoked, async (req,res)=>{
    const user_id = req.user.user_id;
    const game_id = Number(req.body.game_id);

    try {
        const response = await utils.addGameToList(user_id, game_id);
        res.json({data:response, ...checkIfNewAccessToken(req)});
    } catch (e) {
        let status = 500;

        if (e.message === "The user has not been found." || e.message === "The game has not been found.") {
            status = 404;
        }

        res.status(status).json({ message: e.message, status: e.status, timestamp:e.timestamp });
    }
   
});

app.post('/like_comment', verifyToken, checkIfTokenRevoked, async (req,res)=>{
    const user_id = req.user.user_id;
    const game_id = Number(req.body.game_id);
    const comment_id= Number(req.body.comment_id);

    try {
        const response = await utils.addCommentLike(user_id, game_id, comment_id);
        
        res.status(200).json({ data:response, ...checkIfNewAccessToken(req) });
    } catch (e) {
        let status = 500;

        if (e instanceof ReferenceError) {
            status = 400;
        } else if (e.message.includes("not found")) {
            status = 404;
        } else if (e.message.includes("already like")) {
            status = 400;
        }

        res.status(status).json({
            message: e.message,
            status: e.status,
            timestamp: e.timestamp,
        });
    }
   
});

app.post('/unlike_comment', verifyToken, checkIfTokenRevoked, async (req,res)=>{
    const user_id = req.user.user_id;
    const game_id = Number(req.body.game_id);
    const comment_id= Number(req.body.comment_id);

    try {
        const response = await utils.unlikeComment(user_id, game_id, comment_id);
        return res.status(200).json({data:response, ...checkIfNewAccessToken(req)});

    } catch (e) {
        const status = 500;
        return res.status(status).json({
            message: e.message,
            status: e.status,
            timestamp: e.timestamp,
        });
    }
    
});

app.post('/change_password', verifyToken, checkIfTokenRevoked, async (req,res)=>{
    const user_email = req.body.user_email;
    const new_password = req.body.new_password;

    try {
        const response= await utils.changePassword(user_email, new_password);
        return res.status(200).json({data:response});
    } catch (e) {
        let status = 500;

        if (e.message.includes("must")) {
            status = 400;
        } 
        else if (e.message.includes("found")) {
            status = 404;
        }
        return res.status(status).json({ message: e.message, status: e.status, timestamp: e.timestamp });
    }
   
});

app.post('/send_password_recovery_mail', async (req,res) => {
    const user_email = req.user_email;

    if (!user_email) {
        return res.status(400).json({ message: "Email parameter is missing.", status: 400, timestamp: new Date().toString() });
    }
    
    try {

        if (!utils.checkIfEmailIsValid(user_email)) {
            return res.status(400).json({ message: "Invalid mail.", status: 400, timestamp: new Date().toString() });
        }

        const response = await utils.sendPasswordRecoveryEmail(user_email, res);
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({
            message: e.message,
            status: e.status,
            timestamp:e.timestamp,
        });
    }
   
});

app.get('/most_added_games', async (req,res)=>{
    
    try {
        const games = await utils.fetchTenMostAddedGames();
        res.json(games);
    } catch (e) {
        res.status(500).json({ message: e.message, status: e.status, timestamp: e.timestamp });
    }
   
});

app.get('/top_rated_games_by_genre', async (req,res)=>{
    const genre=req.query.genre;

    try {
        const games = await utils.fetchTopRatedGamesByGenre(genre);
        res.status(200).json(games);
    } catch (e) {
        res.status(400).json({ message: e.message || 'An unexpected error occurred', status: 400, timestamp:new Date().toISOString() });
    }
   
});

app.get('/most_recent_games', async (req,res)=>{
    const page_number=req.query.page_number || 1;
    const game_type=req.query.game_type || "any";

    try {
        const games = await utils.fetchMostRecentGames(game_type, page_number);
        res.json(games);
    } catch (e) {
        res.status(500).json({ message: e.message, status: e.status, timestamp: e.timestamp });
    }
   
});

const PORT = 5001; // Changez 5000 en un autre port, comme 5001

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

export default app;