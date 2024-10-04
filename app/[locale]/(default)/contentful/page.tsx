import Image from 'next/image';
import Link from 'next/link';
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
          slug,
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
  return (
    <div className="space-y-4">
      <h1>Contentful Page</h1>
      {data.data?.pageBlogPostCollection?.items.map((post) => (
        <div className="rounded-lg border p-4" key={post?.sys.id}>
           <Link href={`/contentful/${post?.slug}`}>
          <h2>{post?.title}</h2>
          <Image
            alt={post?.featuredImage?.description ?? ''}
            height={200}
            src={post?.featuredImage?.url ?? ''}
            width={200}
          />
           </Link>
        </div>
      ))}
    </div>
  );
}