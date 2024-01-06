const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => {
    return acc + curr.likes;
  }, 0);
};

const mostLikes = (blogs) => {
  const result = blogs.reduce((mostLikedBlog, currentBlog) =>
    currentBlog.likes > mostLikedBlog.likes ? currentBlog : mostLikedBlog,
  );
  const { title, author, likes } = result;
  return { title, author, likes };
};

const mostBlogs = (blogs) => {};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
};
