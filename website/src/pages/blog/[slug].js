import Layout from 'src/components/Layout';
import BlogPost from '../../components/BlogPost';
import { getPostBySlug, getAllPosts } from 'src/util/blog';

const PostPage = ({ post }) => (
  <Layout>
    <pre>
      {`
      title=${post.title}
      description=${post.excerpt}
      imageUrl=${post.coverImage}
      imageAlt=${post.coverImageAlt}
      `}
    </pre>

    <BlogPost post={post} />
  </Layout>
);

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'excerpt',
    'date',
    'slug',
    'author',
    'authorLink',
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
    paths: posts.map(post => ({
      params: { ...post },
    })),
    fallback: false,
  };
}

export default PostPage;
