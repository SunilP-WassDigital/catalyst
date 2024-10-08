import Image from 'next/image';

import { Button } from '~/components/ui/button';
import { Slideshow } from '~/components/ui/slideshow';
import { contentfulClient, contentfulGraphql } from '~/lib/contentful/client';
const GetBlogPostsQuery = contentfulGraphql(`
  query {
  homepageBannerCollection{
    items{
      sys{
        id
      }
      banner{
        url
        description
      }
    }
  }
}
`);

const { data } = await contentfulClient.query(GetBlogPostsQuery, {});
console.log(data);

const slides = data?.homepageBannerCollection?.items.map((post) => (
  <div className="slide" key={post?.sys.id}>
    <Image
      src={post?.banner?.url || '/placeholder.png'} // Fallback image
      alt={post?.banner?.description || 'No description'}
      width={800}
      height={800}
    />    
  </div>
));
console.log(slides);
export const Hero = () => <Slideshow slides={slides} />;
