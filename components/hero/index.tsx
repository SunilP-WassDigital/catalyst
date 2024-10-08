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
      headline
    }
  }
}
`);

const { data } = await contentfulClient.query(GetBlogPostsQuery, {});
console.log(data);

const slides = data?.homepageBannerCollection?.items.map((post) => (
  <div className="slide" key={post?.sys.id}>
     <div
    key={post?.sys?.id}  // It's a good practice to add a key when mapping over elements.
    className="relative bg-cover bg-center h-screen"
    style={{
      backgroundImage: `url(${post?.banner?.url || '/placeholder.png'})`,
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-start">
      <div className="w-1/2 pl-8">  {/* w-1/3 sets the width to 30% */}
      <h1 className="text-black text-lg md:text-2xl font-semibold leading-relaxed">
          {post?.headline || 'Your Text Here'}
        </h1>
      </div>
    </div>
  </div>
</div>
));
export const Hero = () => {
  return slides
}
