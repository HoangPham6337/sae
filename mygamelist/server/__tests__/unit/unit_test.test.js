import mockData from "../../mockdata.js";
import User from "../../Schemas/Users.js";
import Game from "../../Schemas/Games.js";
import Comment from "../../Schemas/Comments.js";
import Token from "../../Schemas/Tokens.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { sign } from "cookie-signature";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import nodemailer  from 'nodemailer';
import * as utils from "../../app_functions.js";



jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"), 
  model: jest.fn((modelName) => {
    if (modelName === "Games") {
      
      return {
        findOne: jest.fn().mockResolvedValue({
          game_id: 1,
          title: "Journey",
          description:
            "A third-person adventure game in which the player, controlling a robed figure, makes a pilgrimage through a desert landscape to a rugged mountain with a beacon of light in the distance while uncovering the history of their people, rescuing and cooperating with friendly creatures, avoiding predatory ones and communicating with other travelers.",
          platforms: [
            "PC (Microsoft Windows)",
            "PlayStation 3",
            "iOS",
            "PlayStation 4",
          ],
          platform_logos: [
            {
              thumb: "//images.igdb.com/igdb/image/upload/t_thumb/plim.jpg",
              original:
                "//images.igdb.com/igdb/image/upload/t_original/plim.jpg",
            },
            {
              thumb:
                "//images.igdb.com/igdb/image/upload/t_thumb/tuyy1nrqodtmbqajp4jg.jpg",
              original:
                "//images.igdb.com/igdb/image/upload/t_original/tuyy1nrqodtmbqajp4jg.jpg",
            },
            {
              thumb: "//images.igdb.com/igdb/image/upload/t_thumb/pl6w.jpg",
              original:
                "//images.igdb.com/igdb/image/upload/t_original/pl6w.jpg",
            },
            {
              thumb: "//images.igdb.com/igdb/image/upload/t_thumb/pl6f.jpg",
              original:
                "//images.igdb.com/igdb/image/upload/t_original/pl6f.jpg",
            },
          ],
          genres: ["Platform", "Adventure"],
          cover: {
            thumb: "//images.igdb.com/igdb/image/upload/t_thumb/co1q8q.jpg",
            original:
              "//images.igdb.com/igdb/image/upload/t_original/co1q8q.jpg",
          },
          developers: ["ThatGameCompany"],
          publishers: ["Annapurna Interactive", "Sony Computer Entertainment"],
        }),

        find: jest.fn().mockResolvedValue([
          { game_id: 2, genre: ["action"], year: "2020", name: "Game 2" },
          {
            game_id: 3,
            genre: ["action", "adventure"],
            year: "2021",
            name: "Game 3",
          },
        ]),
      };
    } else if (modelName === "Users") {
        return {
        findOne: jest.fn().mockResolvedValue({
            user_id: 3316,
            username: "username_3316",
            pass: "$2b$10$bcbZPdhSrfnTFLGQPQ7F3e/iYbzwy8H4eKEsfmLPd11vYhyj8ktgi",
            email: "3316@gmail.com",
            game_list: [1, 2, 3],
            profile_picture: "https://example.com/default-profile.png",
            created_at: "2024-11-29T12:00:00Z",
        }),

        updateOne: jest.fn().mockResolvedValue({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1,
        }),

        deleteOne: jest.fn().mockResolvedValue({
            acknowledged: true,
            deletedCount: 1
        }),
        };
    } else if (modelName === "Tokens") {
        return {
            insertMany: jest.fn().mockResolvedValue({
                "acknowledged": true,
                "insertedCount": 2,
                "insertedIds": {
                  "0": "some_generated_id_1",
                  "1": "some_generated_id_2"
                }
            })
        }
    } else if (modelName === "Comments") {
        return {
          find: jest.fn().mockResolvedValue({
            skip: jest.fn().mockImplementation((skipValue) => {
              return {
                limit: jest.fn().mockImplementation((limit) => {
                  return [
                    { "comment_id":1, "user_id":6309, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":2, "user_id":3333, "game_id":1, "content":"Cool", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":3, "user_id":4444, "game_id":1, "content":"Osef", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":4, "user_id":5555, "game_id":1, "content":"ok", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":5, "user_id":6666, "game_id":1, "content":"Saaaa", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":6, "user_id":7777, "game_id":1, "content":"bbbb", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":7, "user_id":8888, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":8, "user_id":9999, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":9, "user_id":1010, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
                    { "comment_id":10,"user_id":1111, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" }
                  ]
                })
              }
            })
          }),

          findOne: jest.fn().mockResolvedValue({
            comment_id: 51
          }),

          updateOne: jest.fn().mockResolvedValue({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1,

          }),

        }
    }


   
    return {}; 
  }),
}));
jest.mock("../../Schemas/Games");
jest.mock("../../Schemas/Comments");
jest.mock("../../Schemas/Tokens");

jest.mock('bcrypt',() => {
    return {
        hash: jest.fn().mockResolvedValue("hashPassword12*"),
        compare: jest.fn().mockResolvedValue(true)
    }
})
afterEach(() => {
  // Nettoyage des mocks/timers
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

describe("checkIfEmailIsValid tests", () => {
  afterEach(() => {
  // Nettoyage des mocks/timers
  jest.clearAllTimers();
  jest.restoreAllMocks();
});
  test("should return true for valid email adress.", () => {
    // Arrange
    const attempt_email = "Saorichan12785@gmail.com";
    const expected_response = true;

    // Act
    const actual_response = utils.checkIfEmailIsValid(attempt_email);

    // Asserts

    expect(actual_response).toBe(expected_response);
  });

  test("should return false for invalid emails adress.", () => {
    // Arrange
    const attempt_email = [
      "stanlislasse12785gmail.com",
      "tomtom..@gmail.com",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com",
      "tata@.gmail.com",
      "toto@gmailllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll.com",
      "titi@gmail.testtest",
      "@gmail.com",
      "gmail.com",
      ".com",
    ];
    const expected_response = false;

    // Act
    attempt_email.forEach((email) => {
      const actual_response = utils.checkIfEmailIsValid(email);

      // Asserts
      expect(actual_response).toBe(expected_response);
    });
  });

  test("should return an exception if no email specified.", () => {
    // Arrange
    const attempt_email = "";

    // Arrange & Asserts
    expect(() => utils.checkIfEmailIsValid(attempt_email)).toThrowError(
      ReferenceError
    );
    expect(() => utils.checkIfEmailIsValid(attempt_email)).toThrowError(
      "Missing argument."
    );
  });

  test("should return an exception if email argument has wrong type.", () => {
    // Arrange
    const attempt_email = 1224;

    // Arrange & Asserts
    expect(() => utils.checkIfEmailIsValid(attempt_email)).toThrowError(
      TypeError
    );
    expect(() => utils.checkIfEmailIsValid(attempt_email)).toThrowError(
      "Argument has wrong type."
    );
  });
});

describe("checkIfUserNameIsValid test", () => {
  test("should return an exception if no username specified.", () => {
    // Arrange
    const attempt_username = "";

    // Arrange & Asserts
    expect(() => utils.checkIfUserNameIsValid(attempt_username)).toThrowError(
      ReferenceError
    );
    expect(() => utils.checkIfUserNameIsValid(attempt_username)).toThrowError(
      "Missing argument."
    );
  });

  test("should return an exception if username argument has wrong type.", () => {
    // Arrange
    const attempt_username = 1224; // not a string

    // Arrange & Asserts
    expect(() => utils.checkIfUserNameIsValid(attempt_username)).toThrowError(
      TypeError
    );
    expect(() => utils.checkIfUserNameIsValid(attempt_username)).toThrowError(
      "Argument has wrong type."
    );
  });

  test("should return false for usernames exceeding the length limit (more than 35 characters).", () => {
    // Arrange
    const attempt_username =
      "thisusernameiswaytooooooooooooooooooooooooooolongtoaccept";
    const expected_response = false;

    // Act
    const actual_response = utils.checkIfUserNameIsValid(attempt_username);

    // Asserts
    expect(actual_response).toBe(expected_response);
  });

  test("should return true for valid usernames within length limit (between 7 and 35 characters).", () => {
    // Arrange
    const attempt_username = "validUserName123";
    const expected_response = true;

    // Act
    const actual_response = utils.checkIfUserNameIsValid(attempt_username);

    // Asserts
    expect(actual_response).toBe(expected_response);
  });

  test("should return false for usernames with consecutive dots or hyphens.", () => {
    // Arrange
    const invalid_usernames = [
      "user..name", // consecutive dots
      "user--name", // consecutive hyphens
      "user.-name", // dot followed by hyphen
      "-user.name", // hyphen followed by dot
    ];
    const expected_response = false;

    // Act & Assert
    invalid_usernames.forEach((username) => {
      const actual_response = utils.checkIfUserNameIsValid(username);
      expect(actual_response).toBe(expected_response);
    });
  });
});

describe("checkIfPassIsValid tests", () => {
  test("should return true for valid password.", () => {
    // Arrange
    const attempt_password = "ValidPassword123!";
    const expected_response = true;

    // Act
    const actual_response = utils.checkIfPassIsValid(attempt_password);

    // Assert
    expect(actual_response).toBe(expected_response);
  });

  test("should return false for invalid passwords.", () => {
    // Arrange
    const invalid_passwords = [
      "validpassword", // No uppercase letter
      "VALIDPASSWORD", // No lowercase letter
      "ValidPassword", // No digit
      "ValidPassword123", // No special character
      "Short1!", // Too short
      "A".repeat(129) + "1!", // Too long
      "Invalid  Password123!", // Consecutive spaces
    ];
    const expected_response = false;

    // Act & Assert
    invalid_passwords.forEach((password) => {
      const actual_response = utils.checkIfPassIsValid(password);
      expect(actual_response).toBe(expected_response);
    });
  });

  test("should throw an exception if no password is specified.", () => {
    // Arrange
    const attempt_password = "";

    // Assert
    expect(() => utils.checkIfPassIsValid(attempt_password)).toThrowError(
      ReferenceError
    );
    expect(() => utils.checkIfPassIsValid(attempt_password)).toThrowError(
      "Missing argument."
    );
  });

  test("should throw an exception if password argument has wrong type.", () => {
    // Arrange
    const attempt_password = 123456;

    // Assert
    expect(() => utils.checkIfPassIsValid(attempt_password)).toThrowError(
      TypeError
    );
    expect(() => utils.checkIfPassIsValid(attempt_password)).toThrowError(
      "Argument has wrong type."
    );
  });
});

describe("hashPassword tests", () => {
  test("should return a hashed password for a valid password.", async () => {
    // Arrange
    const attempt_password = "ValidPassword123!";
    const expected_response = expect.any(String);

    // Act
    const actual_response = await utils.hashPassword(attempt_password);

    // Assert
    expect(actual_response).toEqual(expected_response);
  });

  test("should throw an exception if no password is specified (empty string).", async () => {
    // Arrange
    const attempt_password = "";

    // Assert
    await expect(utils.hashPassword(attempt_password)).rejects.toThrowError(
      ReferenceError
    );
    await expect(utils.hashPassword(attempt_password)).rejects.toThrowError(
      "Missing argument."
    );
  });

  test("should throw an exception if password argument has wrong type (number).", async () => {
    // Arrange
    const attempt_password = 123456;

    // Assert
    await expect(utils.hashPassword(attempt_password)).rejects.toThrowError(
      TypeError
    );
    await expect(utils.hashPassword(attempt_password)).rejects.toThrowError(
      "Argument has wrong type."
    );
  });

  test("should handle bcrypt error correctly.", async () => {
    // Arrange
    const attempt_password = "ValidPassword123!";

    // Mock bcrypt.hash to simulate an error (e.g. bcrypt may fail)
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error("Bcrypt error");
    });

    // Act
    const actual_response = await utils.hashPassword(attempt_password);

    // Assert
    expect(actual_response).toEqual(new Error("Bcrypt error")); // It should return the error we mocked
  });
});

describe("addGameToList tests", () => {
  test("should throw an error if user_id is not specified", async () => {
    const attempt_user_id = undefined;
    const attempt_game_id = 1;
    // Act & Assert
    await expect(
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrow(
      "The property user_id of the object req.user has not been specified."
    );
  });

  test("should throw an error if game_id is not specified", async () => {
    // Arrange
    const attempt_user_id = 3316;
    const attempt_game_id = undefined;

    // Act & Assert
    await expect(() =>
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrowError("No game_id specified.");
  });

  test("should throw an error if user_id is of wrong type", async () => {
    // Arrange
    const attempt_user_id = "3316";
    const attempt_game_id = 1;

    // Act & Assert
    await expect(() =>
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrowError("Arguments must be number.");
  });

  test("should throw an error if game_id is of wrong type", async () => {
    // Arrange
    const attempt_user_id = 3316;
    const attempt_game_id = "1";

    // Act & Assert
    await expect(() =>
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrowError("Arguments must be number.");
  });

  test("should throw an error if no game is found in the database", async () => {
    // Arrange
    const attempt_user_id = 3316;
    const attempt_game_id = 9999999;

    Game.findOne.mockResolvedValue(null);

    // Act & Assert
    await expect(
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrowError("The game has not been found.");
  });

  test("should throw an error if no user is found in the database", async () => {
    // Arrange
    const attempt_user_id = 2333;
    const attempt_game_id = 1;

    Game.findOne.mockResolvedValue({ game_id: "game123" });
    User.findOne.mockResolvedValue(null);

    // Act & Assert
    await expect(
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrowError("The user has not been found.");
  });

  test("should throw an error if game is already in the user's list", async () => {
    // Arrange
    const attempt_user_id = 3316;
    const attempt_game_id = 1;

    // Act & Assert
    await expect(
      utils.addGameToList(attempt_user_id, attempt_game_id)
    ).rejects.toThrowError("The game is already in the user's list.");
  });

  test("should add the game to the user's list when all checks pass", async () => {
    // Arrange
    const attempt_user_id = 3316;
    const attempt_game_id = 2;
    const expected_response = { n: 1, nModified: 1, ok: 1 };
    // Act
    const result = await utils.addGameToList(attempt_user_id, attempt_game_id);

    // Assert
    await expect(result).toEqual(expected_response);
  });
});

describe("searchGame tests", () => {
  test("should throw error if no filters are specified.", async () => {
    // Arrange
    const attempt_filters = {};
    const attempt_page_number = 1;

    // Act & Assert
    await expect(
      utils.searchGame(attempt_filters, attempt_page_number)
    ).rejects.toThrowError(ReferenceError);
    await expect(
      utils.searchGame(attempt_filters, attempt_page_number)
    ).rejects.toThrowError("No filters have been specified.");
  });

  test("should throw error if wrong type arguments.", async () => {
    // Arrange
    const attempt_filters = "Journey";
    const attempt_page_number = 1;

    // Act & Assert
    await expect(
      utils.searchGame(attempt_filters, attempt_page_number)
    ).rejects.toThrowError(TypeError);
    await expect(
      utils.searchGame(attempt_filters, attempt_page_number)
    ).rejects.toThrowError("filters argument must be a objet.");
  });

  test("should return games with valid filters.", async () => {
    // Arrange
    const attempt_filters = { title: "Game", genre: "action" };
    const attempt_page_number = 1;
    const expect_response = [
      { game_id: 2, genre: ["action"], year: "2020", name: "Game 2" },
      {
        game_id: 3,
        genre: ["action", "adventure"],
        year: "2021",
        name: "Game 3",
      },
    ];
    Game.find.mockResolvedValue(expect_response);

    // Act
    const actual_response = await utils.searchGame(
      attempt_filters,
      attempt_page_number
    );

    // Assert
    expect(actual_response).toEqual(expect_response);
  });

  test("should call mongoose find with correct filters and page number.", async () => {
    // Arrange
    const attempt_filters = { genre: "puzzle" };
    const attempt_page_number = 2;
    const expect_response = [
      { game_id: 30, genre: "puzzle", year: "2022", name: "Game 30" },
    ];

    // Act
    Game.find.mockResolvedValue(expect_response);
    await utils.searchGame(attempt_filters, attempt_page_number);

    // Assert
    expect(mongoose.Model.find).toHaveBeenCalledWith({ genre: "puzzle" });
  });
});

describe("getUserGameList tests", () => {
  test("should return the user's game list if user_id is valid.", async () => {
    // Arrange
    const attempt_user_id = 3316;
    const expect_game_list = [1, 2, 3];

    // Act
    const actual_game_list = await utils.getUserGameList(attempt_user_id);

    // Assert
    expect(actual_game_list).toEqual(expect_game_list);
  });

  test("should throw an error if user_id is not specified.", async () => {
    // Arrange
    const attempt_user_id = null;

    // Act & Assert
    await expect(utils.getUserGameList(attempt_user_id)).rejects.toThrowError(
      "The user_id has not been specified."
    );
  });

  test("should throw an error if wrong type argument.", async () => {
    // Arrange
    const attempt_user_id = "3316";
    User.findOne.mockResolvedValue(null);

    // Act & Assert
    await expect(utils.getUserGameList(attempt_user_id)).rejects.toThrowError(
      "Wrong type argument."
    );
  });

  test("should throw an error if user does not exist.", async () => {
    // Arrange
    const attempt_user_id = 67890;
    User.findOne.mockResolvedValue(null);

    // Act & Assert
    await expect(utils.getUserGameList(attempt_user_id)).rejects.toThrowError(
      "Your request could not be processed, please check again."
    );
  });
});

describe("addUser tests", () => {
  test("should add a new user to the database", async () => {
    // Arrange
    const attempt_user_email = "newuser@example.com";
    const attempt_user_username = "newuser123";
    const attempt_user_pass = "SecurePass123!";
    const expected_response = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    };

    // Act
    const response = await utils.addUser(
      attempt_user_email,
      attempt_user_pass,
      attempt_user_username
    );

    // Assert
    expect(response).toEqual(expected_response);
  });

  test("should throw an error if arguments are missing", async () => {
    // Arrange
    const missingArgsCases = [
      {
        email: null,
        pass: "pass",
        username: "user",
        message: "missing arguments.",
      },
      {
        email: "email",
        pass: null,
        username: "user",
        message: "missing arguments.",
      },
      {
        email: "email",
        pass: "pass",
        username: null,
        message: "missing arguments.",
      },
    ];

    // Act & Asserts
    for (const testCase of missingArgsCases) {
      await expect(
        utils.addUser(testCase.email, testCase.pass, testCase.username)
      ).rejects.toThrowError(testCase.message);
    }
  });

  test("should throw an error if arguments are wrong type", async () => {
    // Arrange
    const invalidTypeCases = [
      {
        email: 12345,
        pass: "pass",
        username: "user",
      },
      {
        email: "email",
        pass: {},
        username: "user",
      },
      {
        email: "email",
        pass: "pass",
        username: [],
      },
    ];

    // Act & Asserts
    for (const testCase of invalidTypeCases) {
      await expect(
        utils.addUser(testCase.email, testCase.pass, testCase.username)
      ).rejects.toThrowError("Wrong type arguments.");
    }
  });

  test("should throw an error if email, username, or password is invalid", async () => {
    // Test cases for invalid inputs
    const invalidInputsCases = [
      {
        email: "invalid-email",
        pass: "ValidPass123!",
        username: "user",
        message: "Invalid email.",
      },
      {
        email: "validemail@example.com",
        pass: "weakpass",
        username: "user",
        message: "Invalid password.",
      },
    ];

    for (const testCase of invalidInputsCases) {
      await expect(
        utils.addUser(testCase.email, testCase.pass, testCase.username)
      ).rejects.toThrowError(testCase.message);
    }
  });

  test("should throw an error if email or username is already taken", async () => {
    // Arrange
    const attempt_user_email = "3316@gmail.com";
    const attempt_user_username = "mateloAlphonse";
    const attempt_user_pass = "ValidPass123!";

    // Act & Assert
    await expect(
      utils.addUser(
        attempt_user_email,
        attempt_user_pass,
        attempt_user_username
      )
    ).rejects.toThrowError("Email or username already taken.");
  });

  test("should handle unexpected errors gracefully", async () => {
    // Arrange
    const attempt_user_email = "user@unexpected.com";
    const attempt_user_username = "unexpectedUser";
    const attempt_user_pass = "ValidPass123!";

    User.updateOne.mockRejectedValue(new Error("Unexpected error."));

    // Act & Assert
    await expect(
      utils.addUser(
        attempt_user_email,
        attempt_user_pass,
        attempt_user_username
      )
    ).rejects.toThrowError("Unexpected error.");
  });
});

describe("delUser function tests", () => {
  
    test("should delete a user when valid user ID and password are provided", async () => {
      // Arrange
      const user_id = 1212;
      const attempt_pass = "hashPassword12*";
      const expected_response = {
        acknowledged: true,
        deletedCount: 1
      };
  
      User.findOne.mockResolvedValue({ user_id:1212, user_pass: "hashPassword12*" });
     
      // Act
      const response = await utils.delUser(user_id, attempt_pass);
  
      // Assert
      expect(response).toEqual(expected_response);
    });
  
    test("should throw an error if user ID or password is not provided", async () => {
      // Arrange
      const expected_response_id = "No user id specified.";
      const expected_response_pass = "No password specified.";
  
      // Act & Assert
      await expect(utils.delUser(null, "ValidPassword123!")).rejects.toThrowError(expected_response_id);
      await expect(utils.delUser("validUserId123", null)).rejects.toThrowError(expected_response_pass);
    });
  
    test("should throw an error if password is too long", async () => {
      // Arrange
      const user_id = "validUserId123";
      const attempt_pass = "A".repeat(129); // Password with 129 characters
      const expected_response = "The information provided is incorrect.";
  
      // Act & Assert
      await expect(utils.delUser(user_id, attempt_pass)).rejects.toThrowError(expected_response);
    });
  
    test("should throw an error if no user is found with the provided ID", async () => {
      // Arrange
      const user_id = "invalidUserId456";
      const attempt_pass = "ValidPassword123!";
      const expected_response = "No user has been found.";
  
      // Mocking the behavior of findUser to return null
      User.findOne.mockResolvedValue(null);
  
      // Act & Assert
      await expect(utils.delUser(user_id, attempt_pass)).rejects.toThrowError(expected_response);
    });
  
    test("should throw an error if the password does not match", async () => {
      // Arrange
      const user_id = 151515;
      const attempt_pass = "WrongPassword123!";
      const expected_response = "The information provided is incorrect.";
  
      // Mocking the behavior of findUser and bcrypt comparison
      bcrypt.compare.mockRejectedValue(false);
      User.findOne.mockResolvedValue({ user_id: 151515, user_pass: "Acx47D4fd5gVc*fd*" });
  
      // Act & Assert
      await expect(utils.delUser(user_id, attempt_pass)).rejects.toThrowError(expected_response);
    });
  
    test("should throw an error if the delete operation fails", async () => {
      // Arrange
      const user_id = "validUserId123";
      const attempt_pass = "ValidPassword123!";
      const expected_response = "Error deleting the user.";
  
      // Mocking the behavior of findUser and delUser
      User.findOne.mockResolvedValue({ user_id: 151515, user_pass: "Acx47D4fd5gVc*fd*" });
      User.deleteOne.mockRejectedValue(new Error("Error deleting the user."));
  
      // Act & Assert
      await expect(utils.delUser(user_id, attempt_pass)).rejects.toThrowError(expected_response);
    });
  });

  describe("processLogin tests", () => {

    test("should throw an error if no password is specified", async () => {
        // Arrange
        const user_email = "valid@example.com";
        const user_pass = null; 
        const expected_response = "No password has been specified.";

        // Act & Assert
        await expect(utils.processLogin(user_email, user_pass)).rejects.toThrowError(expected_response);
    });

    test("should throw an error if user does not exist", async () => {
        // Arrange
        const user_email = "nonexistent@example.com";
        const user_pass = "ValidPassword123";
        const expected_response = "The data entered did not allow you to be authenticated.";

        // Mock the database lookup to return null
        User.findOne.mockResolvedValue(null);

        // Act & Assert
        await expect(utils.processLogin(user_email, user_pass)).rejects.toThrowError(expected_response);
    });

    test("should throw an error if the password does not match", async () => {
        // Arrange
        const user_email = "valid@example.com";
        const user_pass = "WrongPassword123";
        const expected_response = "The data entered did not allow you to be authenticated.";

        // Mock the database lookup and bcrypt comparison
        User.findOne.mockResolvedValue({ user_email:"valid@example.com", user_pass: await bcrypt.hash("ValidPassword123", 10) });
        bcrypt.compare.mockRejectedValue(false);

        // Act & Assert
        await expect(utils.processLogin(user_email, user_pass)).rejects.toThrowError(expected_response);
    });

    test("should generate access and refresh tokens if login is successful", async () => {
        // Arrange
        const user_email = "valid@example.com";
        const user_pass = "ValidPassword123";
        const expected_access_token = "mockedAccessToken";
        const expected_refresh_token = "mockedRefreshToken";

        const user = { 
            user_id: "validUserId123", 
            user_email: user_email, 
            photoprofil: "userProfilePictureUrl", 
            pass: await bcrypt.hash(user_pass, 10) 
        };

        // Mock the database lookup and bcrypt comparison
        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);

        // Mock JWT sign
        jwt.sign = jest.fn().mockReturnValueOnce(expected_access_token).mockReturnValueOnce(expected_refresh_token);

        // Act
        const result = await utils.rocessLogin(user_email, user_pass, {});

        // Assert
        expect(result).toHaveProperty("accessToken", expected_access_token);
        expect(result).toHaveProperty("refreshToken", expected_refresh_token);
        expect(jwt.sign).toHaveBeenCalledTimes(2); // Check if jwt.sign was called twice (once for access token and once for refresh token)
    });

    test("should throw an error if JWT signing fails", async () => {
        // Arrange
        const user_email = "valid@example.com";
        const user_pass = "ValidPassword123";
        const expected_response = "Error during token generation.";

        const user = { 
            user_id: "validUserId123", 
            user_email: user_email, 
            photoprofil: "userProfilePictureUrl", 
            pass: await bcrypt.hash(user_pass, 10) 
        };

        // Mock the database lookup and bcrypt comparison
        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true); // Simulate successful password match

        // Mock JWT sign to throw an error
        jwt.sign = jest.fn().mockImplementation(() => { throw new Error("Error during token generation."); });

        // Act & Assert
        await expect(utils.processLogin(user_email, user_pass, {})).rejects.toThrowError(expected_response);
    });
});


describe("logoutProcess tests", () => {

    test("should add the tokens in the blacklist when they are provided", async () => {
        // Arrange
        const refreshToken = "validRefreshToken";
        const accessToken = "validAccessToken";
        const user = {
            user_id: 3316,
        };
        const req = {
            user: user,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'x-forwarded-for': "203.0.113.195"
            }

        };

        const expectedResponse = {
            "acknowledged": true,
            "insertedCount": 2,
            "insertedIds": {
              "0": "some_generated_id_1",
              "1": "some_generated_id_2"
            }
        };


        // Act
        const result = await utils.logoutProcess(refreshToken, accessToken, req);

        // Assert
        expect(result).toEqual(expectedResponse);
    });

    test("should throw an error if no tokens are provided", async () => {
        // Arrange
        const attempt_refreshToken = null;
        const attempt_accessToken = null;
        const attempt_user = { user_id: 3316 };
        const attempt_req = {
            user: attempt_user,
         
        };

        const expected_response = "Both refreshToken and accessToken are required.";
    
        // Act & Assert
        await expect(utils.logoutProcess(attempt_refreshToken, attempt_accessToken, attempt_req)).rejects.toThrowError(ReferenceError);
        await expect(utils.logoutProcess(attempt_refreshToken, attempt_accessToken, attempt_req)).rejects.toThrowError(expected_response);
    });
    

    test("should throw an error if missing user-agent header", async () => {
        // Arrange
        const attempt_refreshToken = "validRefreshToken";
        const attempt_accessToken = "validAccessToken";
        const attempt_user = {
            user_id: 3316,
        };
        const attempt_req = {
            user: attempt_user,
            headers: {},
            socket: {
                remoteAddress: '192.168.1.2'
            }
        };

        const expected_response = "User-Agent header is missing.";

        // Act & Assert
        await expect(utils.logoutProcess(attempt_refreshToken, attempt_accessToken, attempt_req)).rejects.toThrowError(Error);
        await expect(utils.logoutProcess(attempt_refreshToken, attempt_accessToken, attempt_req)).rejects.toThrowError(expected_response);
    });

    test("should throw an error if addToken fails", async () => {
        // Arrange
        const refreshToken = "validRefreshToken";
        const accessToken = "validAccessToken";
        const user = {
            user_id: 3316,
        };
        const req = {
            user: user,
            headers: {
                'user-agent': 'Mozilla/5.0',
                'x-forwarded-for': '192.168.1.1'
            },
            socket: {
                remoteAddress: '192.168.1.2'
            }
        };

        const errorMessage = "Error while adding token";
        utils.addToken = jest.fn().mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(utils.logoutProcess(refreshToken, accessToken, req)).rejects.toThrowError(errorMessage);
    });
});

describe('fetchGameComments tests', () => {

  
  beforeEach(() => {
      jest.clearAllMocks();
  });

  test('should throw an error if game_id or page_number is not specified', async () => {
      await expect(utils.fetchGameComments(null, 1)).rejects.toThrow('Game Id not specified.');
      await expect(utils.fetchGameComments(1, null)).rejects.toThrow('Page number not specified.');
  });

  test('should throw an error if game not found', async () => {
      // Arrange
      const attempt_game_id = 1;
      const attempt_page_number = 1;
      Game.findOne = jest.fn().mockResolvedValue(null);

      // Act & Asserts
      await expect(utils.fetchGameComments(attempt_game_id, attempt_page_number)).rejects.toThrow('Game not found.');
  });

  test('should return comments if game exists', async () => {
      // Arrange
      const attempt_game_id = 1;
      const attempt_page_number = 1;
      const expected_response = [
        { "comment_id":1, "user_id":6309, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":2, "user_id":3333, "game_id":1, "content":"Cool", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":3, "user_id":4444, "game_id":1, "content":"Osef", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":4, "user_id":5555, "game_id":1, "content":"ok", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":5, "user_id":6666, "game_id":1, "content":"Saaaa", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":6, "user_id":7777, "game_id":1, "content":"bbbb", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":7, "user_id":8888, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":8, "user_id":9999, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":9, "user_id":1010, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" },
        { "comment_id":10,"user_id":1111, "game_id":1, "content":"Super", "parent_id":0, "likes":[], "created_at":"2024-11-29T12:00:00Z" }
      ];
      
      // Act
      const comments = await utils.fetchGameComments(attempt_game_id, attempt_page_number);

      // Asserts
      expect(comments).toEqual(expected_response);
      expect(utils.fetchGameComments).toHaveBeenCalledWith(attempt_game_id, attempt_page_number);
  });

  test('should propagate any unexpected errors', async () => {
    // Arrange
      const attempt_game_id = 1;
      const attempt_page_number = 1;
      
      Comment.find.skip.limit = jest.fn().mockRejectedValue(new Error('Unexpected error'));
      
      // Act & Asserts
      await expect(utils.fetchGameComments(attempt_game_id, attempt_page_number)).rejects.toThrow('Unexpected error');
  });

});

describe('addComment tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  test('should throw an error if the user or the game is not found', async () => {
    // Arrange
    const attempt_user_id = 1;
    const attempt_comment_content = 'This is a comment';
    const attempt_game_id = 123;
    const attempt_parent_id = null;

    // Mock not found user
    User.findOne.mockResolvedValue(null);
    // Mock found game
    Game.findOne.mockResolvedValue({ game_id: attempt_game_id });

    // Act & Assert (User not found)
    await expect(utils.addComment(attempt_user_id, attempt_comment_content, attempt_game_id, attempt_parent_id))
        .rejects
        .toThrow('User not found.');

    // Mock found user
    User.findOne.mockResolvedValue({ id: attempt_user_id });
    // Mock not found game
    Game.findOne.mockResolvedValue(null);

    // Act & Assert (Game not found)
    await expect(utils.addComment(attempt_user_id, attempt_comment_content, attempt_game_id, attempt_parent_id))
        .rejects
        .toThrow('Game not found.');
});

  test('should successfully add a comment when both user and game are found', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_comment_content = 'This is a comment';
      const attempt_game_id = 123;
      const attempt_parent_id = null;
      const expected_response = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
      };

      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id }); 

      // Act
      const result = await utils.addComment(attempt_user_id, attempt_comment_content, attempt_game_id, attempt_parent_id);

      // Assert
      expect(result).toEqual(expected_response);
      expect(User.findOne).toHaveBeenCalledWith(attempt_user_id);
      expect(Game.findOne).toHaveBeenCalledWith({ game_id: attempt_game_id }, 1);
      expect(Comment.updateOne).toHaveBeenCalledWith({
          user_id: attempt_user_id,
          comment_content: attempt_comment_content,
          game_id: attempt_game_id,
          parent_id: attempt_parent_id,
      }); 
  });

  
  test('should propagate any other errors that occur', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_comment_content = 'This is a comment';
      const attempt_game_id = 123;
      const attempt_parent_id = null;
      const error_message = 'Some unexpected error occurred';

      User.findOne.mockRejectedValue(new Error(error_message));

      // Act & Assert
      await expect(utils.addComment(attempt_user_id, attempt_comment_content, attempt_game_id, attempt_parent_id))
          .rejects
          .toThrow(error_message);
  });
});

describe('addCommentLike', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  test('should throw an error if any argument is missing', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 5;

      // Act & Assert
      await expect(utils.addCommentLike(null, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow(ReferenceError);
      await expect(utils.addCommentLike(attempt_user_id, null, attempt_comment_id))
          .rejects
          .toThrow(ReferenceError);
      await expect(utils.addCommentLike(attempt_user_id, attempt_game_id, null))
          .rejects
          .toThrow(ReferenceError);
  });


  test('should throw an error if the user, game or the comment is not found', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 456;

    
      User.findOne.mockResolvedValue(null);
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id });
      // Default comment mock

      // Act & Assert (User not found)
      await expect(utils.addCommentLike(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow('User not found.');

      
      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue(null);
      // Default comment mock

      // Act & Assert (Game not found)
      await expect(utils.addCommentLike(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow('Game not found.');

      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id });
      Comment.findOne.mockResolvedValue(null);

      // Act & Assert (Comment not found)
      await expect(utils.addCommentLike(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow('Comment not found or does not belong to the specified game.');
  });

  test('should successfully add a like to the comment when all checks pass', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 456;
      const expected_response = { success: true, message: 'Like added successfully' };

      // Mock the case
      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id });
      Comment.findOne.mockResolvedValue([{ comment_id: attempt_comment_id }]);
      Comment.updateOne.mockResolvedValue(expected_response);

      // Act
      const result = await utils.addCommentLike(attempt_user_id, attempt_game_id, attempt_comment_id);

      // Assert
      expect(result).toEqual(expected_response);
      expect(User.findOne).toHaveBeenCalledWith(attempt_user_id);
      expect(Game.findOne).toHaveBeenCalledWith({ game_id: attempt_game_id }, 1);
      expect(Comment.findOne).toHaveBeenCalledWith(attempt_game_id, 1); 
      expect(Comment.updateOne).toHaveBeenCalledWith(attempt_user_id, attempt_game_id, attempt_comment_id); 
  });

  
  test('should propagate any other unexpected errors', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 456;
      const error_message = 'Some unexpected error occurred';

      // Mock unexpected error
      User.findOne.mockRejectedValue(new Error(error_message));

      // Act & Assert
      await expect(utils.addCommentLike(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow(error_message);
  });
});

describe('delComment tests', () => {
  
  test('should throw an error if the user, game, or comment is not specified', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 1;
      const expected_response = 'Arguments missing.';

      // Act & Assert
      await expect(utils.delComment(attempt_user_id, attempt_game_id, null))
          .rejects
          .toThrow(expected_response);
      await expect(utils.delComment(null, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow(expected_response);
      await expect(utils.delComment(attempt_user_id, null, attempt_comment_id))
          .rejects
          .toThrow(expected_response);
  });

  
  test('should throw an error if the user, game or the comment is not found', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 456;

      
      User.findOne.mockResolvedValue(null);
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id });
      // Default comment mock value

      // Act & Assert (User not found)
      await expect(utils.delComment(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow('Resource not found.');

    
      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue(null);
      // Default comment mock value

      // Act & Assert (Game not found)
      await expect(utils.delComment(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow('Game not found.');

      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id });
      Comment.findOne.mockResolvedValue(null);

      // Act & Assert (Comment not found)
      await expect(utils.delComment(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow('Comment not found.');
  });

  test('should successfully delete a comment when all checks pass', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 456;
      const expected_response = { success: true, message: 'Comment deleted successfully' };

    
      User.findOne.mockResolvedValue({ id: attempt_user_id });
      Game.findOne.mockResolvedValue({ game_id: attempt_game_id });
      Comment.findOne.mockResolvedValue([{ comment_id: attempt_comment_id }]);
      Comment.updateOne.mockResolvedValue(expected_response);

      // Act
      const result = await utils.delComment(attempt_user_id, attempt_game_id, attempt_comment_id);

      // Assert
      expect(result).toEqual(expected_response);  
      expect(User.findOne).toHaveBeenCalledWith(attempt_user_id); 
      expect(Game.findOne).toHaveBeenCalledWith({ game_id: attempt_game_id }, 1);
      expect(Comment.findOne).toHaveBeenCalledWith(attempt_game_id, 1);
      expect(Comment.updateOne).toHaveBeenCalledWith(attempt_comment_id); 
  });

  test('should propagate any other unexpected errors', async () => {
      // Arrange
      const attempt_user_id = 1;
      const attempt_game_id = 123;
      const attempt_comment_id = 456;
      const error_message = 'Some unexpected error occurred';

      User.findOne.mockRejectedValue(new Error(error_message));

      // Act & Assert
      await expect(utils.delComment(attempt_user_id, attempt_game_id, attempt_comment_id))
          .rejects
          .toThrow(error_message);
  });
});