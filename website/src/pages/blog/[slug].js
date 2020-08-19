import BlogPost from '../../components/BlogPost';
import { getPostBySlug, getAllPosts } from '../../api';

const PostPage = ({ post }) => (
  <div>
    <pre>
      {`
      title=${post.title}
      description=${post.excerpt}
      imageUrl=${post.coverImage}
      imageAlt=${post.coverImageAlt}
      `}
    </pre>

    <BlogPost post={post} />
  </div>
);

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'excerpt',
    'date',
    'slug',
    'author',
    'content',
    'coverImage',
    'coverImageAlt',
    'coverImageHeight',
    'coverImageWidth',
    'draft',
  ]);

  return {
    props: { post },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: { ...post },
      };
    }),
    fallback: false,
  };
}

export default PostPage;
