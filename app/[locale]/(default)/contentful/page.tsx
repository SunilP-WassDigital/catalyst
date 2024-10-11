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
    <div className="space-y-4 p-5">
    <h1>Contentful Page</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {data.data?.pageBlogPostCollection?.items.map((post:any) => (
        <div className="rounded-lg border p-4 flex items-start space-x-4" key={post?.sys.id}>
          <Image
            alt={post?.featuredImage?.description ?? ''}
            height={200}
            src={post?.featuredImage?.url ?? ''}
            width={200}
            className="rounded-md"
          />
          <div>
            <Link href={`/contentful/${post?.slug}`}>
              <h2 className="text-xl font-bold">{post?.title}</h2>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}