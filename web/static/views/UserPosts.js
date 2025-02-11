import AbstractView from "./AbstractView.js";
import Post from "./Post.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const posts = window.currentUserPosts;

    if (!posts) {
      return `<div class="text-white text-center text-2xl mt-8">No Posts by this user</div>`;
    }

    const postsHTML = await Promise.all(
      posts.map(async (post) => {
        const postView = new Post({ post });
        return await postView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(""));

    return /* HTML */ `
      <div class="flex flex-row ml-12">
        <!-- Posts Section -->
        <div
          class="flex flex-col items-center justify-center flex-wrap my-8"
          id="posts"
        >
          ${postsHTML}
        </div>
      </div>
    `;
  }
}
