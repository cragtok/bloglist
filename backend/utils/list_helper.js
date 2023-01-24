const dummy = (blogs) => {
    blogs;
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
    const blog = blogs.find((blog) => blog.likes === maxLikes);
    return { title: blog.title, author: blog.author, likes: blog.likes };
};

const mostBlogs = (blogs) => {
    const authorBlogs = {};
    let maxAuthor = {};
    blogs.forEach((blog) => {
        if (!authorBlogs[blog.author]) {
            authorBlogs[blog.author] = 1;
            if (!maxAuthor.author) {
                maxAuthor = { author: blog.author, blogs: 1 };
            }
        } else {
            authorBlogs[blog.author] += 1;
            if (authorBlogs[blog.author] > maxAuthor.blogs) {
                maxAuthor = {
                    author: blog.author,
                    blogs: authorBlogs[blog.author],
                };
            }
        }
    });

    return maxAuthor;
};

const mostLikes = (blogs) => {
    const authorLikes = {};

    blogs.forEach((blog) => {
        if (!authorLikes[blog.author]) {
            authorLikes[blog.author] = blog.likes;
        } else {
            authorLikes[blog.author] += blog.likes;
        }
    });

    const mostLikedAuthor = Object.keys(authorLikes).reduce((a, b) =>
        authorLikes[a] > authorLikes[b] ? a : b
    );

    return { author: mostLikedAuthor, blogs: authorLikes[mostLikedAuthor] };
};

module.exports = { mostLikes, mostBlogs, favoriteBlog, dummy, totalLikes };
