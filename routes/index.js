import express from "express";
import {
  bookController,
  bookRatingController,
  discussionController,
  loginController,
  logoutController,
  readingListController,
  refreshTokenController,
  registerController,
  userController,
} from "../controllers";
import auth from "../middlewares/auth";
const router = express.Router();

// ! Auth Routes
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.patch("/genre/:id", auth, registerController.genre);
router.post("/refresh", refreshTokenController.refresh);
router.post("/logout", auth, logoutController.logout);

//! Book Routes
router.post("/create-book", auth, bookController.createBook);
router.patch("/update-book/:id", auth, bookController.updateBook);
router.get("/get-book/:id", auth, bookController.readBook);
router.delete("/delete-book/:id", auth, bookController.deleteBook);

//! Reading List
router.post(
  "/create-reading-list",
  auth,
  readingListController.createReadingList
);
router.get("/get-book-list", auth, readingListController.readBookList);
router.patch(
  "/update-book-list/:bookId/:listId",
  auth,
  readingListController.updateBookList
);
router.delete(
  "/delete-book-list/:bookId/:listId",
  auth,
  readingListController.deleteBookList
);

// ! Discussion Routes
router.post("/create-discussion", auth, discussionController.createDiscussion);
router.post(
  "/add-discussion-message/:discussionId",
  auth,
  discussionController.addMessage
);
router.get(
  "/get-discussion-message/:discussionId",
  auth,
  discussionController.getDiscussionMessages
);
router.get(
  "/get-specific-discussion/:discussionId",
  auth,
  discussionController.getDiscussionById
);

// ! Book Rating Routes
router.post(
  "/create-book-rating/:bookId",
  auth,
  bookRatingController.createBookRating
);
router.get(
  "/get-book-rating/:bookId",
  auth,
  bookRatingController.getBookRatings
);

router.patch(
  "/update-book-rating/:ratingId",
  auth,
  bookRatingController.updateBookRating
);

router.delete(
  "/delete-book-rating/:ratingId",
  auth,
  bookRatingController.deleteBookRating
);
export default router;
