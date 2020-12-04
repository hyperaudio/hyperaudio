import MDX from '@mdx-js/runtime';

const BlogPost = ({ post }) => {
  const isLocal = process.env.NODE_ENV === 'development';

  return (
    <article>
      {!isLocal && post.draft ? (
        <p>This post has not yet been published. Please try again later.</p>
      ) : (
        <>
          <header>
            <h1>
              {post.draft && <b>draft:</b>}
              {post.title}
            </h1>

            <p>
              Published on {new Date(post.date).toLocaleDateString()} by <a href={post.authorLink}>{post.author}</a>
            </p>
          </header>
          <MDX>{post.content}</MDX>
          <footer>
            <a href={post.authorLink}>{post.author}</a>
          </footer>
        </>
      )}
    </article>
  );
};

export default BlogPost;
