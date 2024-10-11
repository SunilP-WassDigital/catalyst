import { contentfulClient, contentfulGraphql } from '~/lib/contentful/client';
import Image from 'next/image'; // Assuming you're using Next.js for Image component

export const HomePagePosts = async () => {
  // Define the GraphQL query
  const GetBlogPostsQuery = contentfulGraphql(`
    query {
      pageBlogPostCollection(limit: 4) {
        items {
          sys {
            id
          }
          title
          shortDescription
          featuredImage {
            url
            description
          }
        }
      }
    }
  `);

  // Fetch data from Contentful
  const { data } = await contentfulClient.query(GetBlogPostsQuery, {});

  // Return JSX
  return (<>
    <div className='flex items-center justify-between'><h2 className='text-3xl font-black lg:text-4xl'>Contentful Post</h2></div>
    <div className="grid grid-cols-4 gap-4 p-10">
      {data?.pageBlogPostCollection?.items.map((post:any) => (
        <div className="grid-cols-4" key={post?.sys.id}>
          <Image
            alt={post?.featuredImage?.description || 'No description'}
            height={200}
            src={post?.featuredImage?.url || '/placeholder.png'} // Add a fallback URL for the image
            width={200}
          />
           <h2 className=''>{post?.title}</h2>
         
        </div>
      ))}
    </div>
    </>
  );
};