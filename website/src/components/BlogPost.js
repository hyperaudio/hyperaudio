import MDX from '@mdx-js/runtime';
import Link from 'next/link';

const BlogPost = ({ post }) => {
  const isLocal = process.env.NODE_ENV === 'development';

  return (
    <div>
      {!isLocal && post.draft ? (
        <p>This post has not yet been published. Please try again later.</p>
      ) : (
        <>
          <div>
            <h1>
              {post.draft && <b>draft:</b>}
              {post.title}
            </h1>

            <p>Originally published on {new Date(post.date).toLocaleDateString()}</p>
          </div>
          <MDX>{post.content}</MDX>
        </>
      )}
    </div>
  );
};

export default BlogPost;
