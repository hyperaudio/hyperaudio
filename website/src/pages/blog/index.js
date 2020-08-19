/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
import MDX from '@mdx-js/runtime';
import Link from '../../components/Link';
import Layout from '../../Layout';

import { getAllPosts } from '../../api';

const Posts = ({ posts, prevPosts, nextPosts }) => {
  const isLocal = process.env.NODE_ENV === 'development';

  return (
    <Layout>
      {posts &&
        posts
          .filter((post) => {
            return isLocal || !post.draft;
          })
          .map((post) => (
            <div key={post.slug}>
              <h4>
                {post.draft && <b>draft:</b>}
                <Link href={'/blog/' + post.slug} passHref>
                  <a>{post.title}</a>
                </Link>
              </h4>
              <div>
                <MDX>{post.excerpt}</MDX>
              </div>
              <Link href={'/blog/' + post.slug} passHref>
                <a>Read more...</a>
              </Link>
            </div>
          ))}
      <ul>
        <li>
          {prevPosts !== null && (
            <Link href={'/blog/' + prevPosts} passHref>
              <a>« see newer posts</a>
            </Link>
          )}
        </li>
        <li>
          {nextPosts !== null && (
            <Link href={'/blog/' + nextPosts} passHref>
              <a>see older posts »</a>
            </Link>
          )}
        </li>
      </ul>
    </Layout>
  );
};

const PostsPage = ({ posts, prevPosts, nextPosts }) => (
  <Posts posts={posts} prevPosts={prevPosts} nextPosts={nextPosts} />
);

export async function getStaticProps() {
  const posts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'coverImageAlt',
    'coverImageHeight',
    'coverImageWidth',
    'excerpt',
    'draft',
  ]);

  const startIndex = 0;
  const endIndex = 100; // posts per page
  const prevPosts = null;
  const nextPosts = endIndex >= posts.length ? null : 2;

  return {
    props: { posts: posts.slice(startIndex, endIndex), prevPosts, nextPosts },
  };
}

export default PostsPage;
