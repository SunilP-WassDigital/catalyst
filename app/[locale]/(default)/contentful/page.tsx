import Image from 'next/image';

import { contentfulClient, contentfulGraphql } from '~/lib/contentful/client';

export default async function ContentfulPage() {
  const GetBlogPostsQuery = contentfulGraphql(`
    query {
  pageBlogPostCollection {
    items {
          sys {
            id
          }
          _id
          title
          shortDescription,
          featuredImage {
            url,
            description
          }
        }
      }
  }
  `);

  const data = await contentfulClient.query(GetBlogPostsQuery, {});
  console.log(data);
  return (
    <div className="space-y-4">
      <h1>Contentful Page</h1>
      {data.data?.pageBlogPostCollection?.items.map((post) => (
        <div className="rounded-lg border p-4" key={post?.sys.id}>
          <h2>{post?.title}</h2>
          <Image
            alt={post?.featuredImage?.description ?? ''}
            height={200}
            src={post?.featuredImage?.url ?? ''}
            width={200}
          />
        </div>
      ))}
    </div>
  );
}