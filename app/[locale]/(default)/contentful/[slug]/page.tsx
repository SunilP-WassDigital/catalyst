import Image from 'next/image';
import Link from 'next/link';
import { getFormatter } from 'next-intl/server';
import { LocaleType } from '~/i18n';
import { contentfulClient, contentfulGraphql } from '~/lib/contentful/client';
import RichText from '~/components/contentful/RichText'
interface BlogPostPageParams {
	slug: string,
  locale?: LocaleType;
}

interface BlogPostPageProps {
	params: BlogPostPageParams
}
export default async function ContentfulPageDetails({ params: { slug, locale } }: BlogPostPageProps) {
  const format = await getFormatter({ locale });
  const defaultOptions = {
    slug: '',
};

const GetBlogPostsQuery = contentfulGraphql(`
  query GetBlogPostBySlug($slug: String!) {
    pageBlogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys {
          id
        }
        title
        slug,
        publishedDate,
        author{
        name,
        avatar{
          url
          title
          height
          width
        }
        },
        relatedBlogPostsCollection{
          items{
              title,
              slug
              featuredImage {
                url,
                description
                width
                height
              },
            }
        }
        content{
          links{
            entries{
              inline {
                sys {
                  id
                }
                __typename
                ... on  PageBlogPost{
                  title
                  slug
                }
              }
              block{
                sys{
                  id
                }
                ... on ComponentRichImage{
                  image{
                    url
                    description
                    title
                    fileName
                    width
                    height
                  }
                }
              }
            }
            assets {
              block {
                sys {
                  id
                }
                __typename
                ... on Asset{
                  url
                  title
                  description
                  size
                  width
                  height
                }
              }
            }
          }
          json,
        },
        shortDescription,
        featuredImage {
          url,
          description
          width
          height
        },
      }
    }
  }
`);

const variables = {
  slug: slug
};

  const data = await contentfulClient.query(GetBlogPostsQuery,variables);
  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/contentful">← Posts</Link>
      {data.data?.pageBlogPostCollection?.items.map((post:any) => (
        <div className="prose mt-8 border-t pt-8" key={post?.sys.id}>
           <h1 className="mb-2 text-3xl font-black lg:text-5xl">{post?.title}</h1>
           <div className="mb-8 flex">
              <small className="mb-0 text-base text-gray-500 pt-5">
                  {"Publised On :"}{format.dateTime(new Date(post.publishedDate))}
              </small>
              {Boolean(post.author) && (
                <small className="text-base text-gray-500 pt-5">, by {post.author.name}</small>
              )}
              {Boolean(post.author) && <Image
              alt={post.name?.name ?? ''}
              height={100}
              src={post.author.avatar?.url ?? ''}
              width={100}
              className='pl-5'
            />}
            </div>
          <span className='prose mt-8 border-t pt-8 '> <br/></span>
            <Image
              alt={post?.featuredImage?.description ?? ''}
              height={500}
              src={post?.featuredImage?.url ?? ''}
              width={1500}
            />
          <h3 className='mb-4 text-xl font-bold md:text-2xl mt-8 border-t pt-8'>{post?.shortDescription}</h3>
          <RichText document={post?.content} />
          <div className="mb-10 flex mt-8 border-t pt-8">
          {post.relatedBlogPostsCollection.items ? (
             <h1 className="mb-2 text-3xl font-black lg:text-3xl">{"Related Pages :"}</h1>
          ):(
            ''
          )}
          </div>
          <nav className="flex sm:justify-center space-x-4">
          {post.relatedBlogPostsCollection.items.map((relatedPage:any) => (
              <Link href={`/contentful/${relatedPage.slug}`} className="delay-100 duration-100 transform hover:scale-105 transition ease-linear bg-gray-100 px-2 py-2 m-4 inline text-blue-900">{relatedPage.title}</Link>
          ))}
          </nav>
        </div>
      ))}
     </div>
  );
}