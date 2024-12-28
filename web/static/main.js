import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Home from "./components/Home.js";
import Signin from "./components/Signin.js";
import Signup from "./components/Signup.js";
import PostPage from "./components/PostPage.js";
import CreatePost from "./components/CreatePost.js";

// Navigation links
const NavLinks = [
  {
    name: "Home",
    href: "",
    icon: "bxs-home",
    current: true,
  },
  {
    name: "My Posts",
    href: "#my-posts",
    icon: "bxs-notepad",
    current: false,
  },
  {
    name: "Categories",
    href: "#categories",
    icon: "bxs-category",
    current: false,
  },
  {
    name: "Create Post",
    href: "#create-post",
    icon: "bx-plus",
    current: false,
  },
];

// Sample user data
const USERS = [
  {
    username: "hasan",
    image: "https://picsum.photos/200",
    date: "11/12/2024",
  },
  {
    username: "hasan",
    image: "https://picsum.photos/200",
    date: "11/12/2024",
  },
  {
    username: "hasan",
    image: "https://picsum.photos/200",
    date: "11/12/2024",
  },
];

// Sample posts data
const POSTS = [
  {
    username: "hasan",
    image: "https://picsum.photos/200?random=1",
    id: 1,
    title: "Post Title 1",
    category: "Category 1",
    content:
      "Post description, Post description, Post description, Post description",
    likes: 1,
    dislikes: 5,
    created_at: "21/12/2024",
    comments: [
      {
        id: 1,
        content: "Content",
        likes: 83,
        dislikes: 27,
        created_at: "27/12/2024",
      },
      {
        id: 1,
        content: "Content",
        likes: 0,
        dislikes: 2,
        created_at: "27/12/2024",
      },
      {
        id: 1,
        content: "Content",
        likes: 32,
        dislikes: 12,
        created_at: "27/12/2024",
      },
    ],
  },
  {
    username: "ali",
    image: "https://picsum.photos/200?random=2",
    id: 2,
    title: "Post Title 2",
    category: "Category 2",
    content:
      "Post description, Post description, Post description, Post description, Post description,Post description",
    likes: 1,
    dislikes: 5,
    created_at: "21/12/2024",
    comments: [
      {
        id: 1,
        content: "Content",
        likes: 3,
        dislikes: 2,
        created_at: "27/12/2024",
      },
    ],
  },
  {
    username: "ahmed",
    image: "https://picsum.photos/200?random=3",
    id: 3,
    title: "Post Title 3",
    category: "Category 3",
    content:
      "Post description, Post description, Post description, Post description",
    likes: 1,
    dislikes: 5,
    created_at: "21/12/2024",
    comments: [
      {
        id: 1,
        content: "Content",
        likes: 3,
        dislikes: 2,
        created_at: "27/12/2024",
      },
    ],
  },
];

// DOM elements
const root = document.getElementById("root");

// Render Navbar and Footer
const renderLayout = (currentHash) => {
  root.insertAdjacentHTML(
    "beforebegin",
    Navbar(USERS[0], currentHash, NavLinks)
  );
  root.insertAdjacentHTML("afterend", Footer());
};

// Render posts
const renderPosts = () => {
  root.innerHTML = Home(POSTS, USERS);
};

// Render signup form
const renderSignup = () => {
  root.innerHTML = Signup();
};

// Render comments for a given post ID
const renderPostPage = (post) => {
  // Clear the root, then render the Comment component
  root.innerHTML = PostPage(post);
};

// Render create post component
const renderCreatePost = () => {
  root.innerHTML = CreatePost();
};

// Render page based on hash
const renderPage = () => {
  const hash = window.location.hash;

  if (hash.startsWith("#post/")) {
    handlePostRoute(hash);
  } else {
    handleGeneralRoute(hash);
  }
};

// Handle post-related routes (e.g., #post/:id/comments)
const handlePostRoute = (hash) => {
  const parts = hash.split("/");
  const postId = parseInt(parts[1], 10);
  const foundPost = POSTS.find((p) => p.id === postId);

  if (parts[2] === "comments" && foundPost) {
    renderPostPage(foundPost);
  } else {
    renderPosts(); // Fallback to posts list
  }
};

// Handle general routes (e.g., #signup, default)
const handleGeneralRoute = (hash) => {
  const routeMap = {
    "#signup": renderSignup,
    "#create-post": renderCreatePost,
    "": renderPosts,
  };

  (routeMap[hash] || renderPosts)(); // Default to posts if no match
};

// Initialize event listeners
const initEventListeners = () => {
  window.addEventListener("hashchange", renderPage);
  // window.addEventListener("load", renderPage);

  const userMenuButton = document.getElementById("user-menu-button");
  const signinContainer = document.getElementById("signin-container");

  // Toggle user menu
  userMenuButton.addEventListener("click", () => {
    if (!signinContainer.innerHTML) {
      signinContainer.innerHTML = Signin();
    }
    const signinForm = document.getElementById("signin-form");
    signinForm.classList.toggle("hidden");

    // Add event listener to the signup link
    const signupLink = document.getElementById("signup-link");
    signupLink.addEventListener("click", (event) => {
      signinForm.classList.toggle("hidden");
    });
  });
};

// Initialize the app
const initApp = () => {
  renderLayout(window.location.hash);
  renderPage();
  initEventListeners();
};

// Start the app
initApp();
