import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Image from 'next/image';
// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another page blog post)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

function renderOptions(links:any) {
  // create an asset map
  const assetMap = new Map();
  // loop through the assets and add them to the map
  for (const asset of links.assets.block) {
    assetMap.set(asset.sys.id, asset);
  }

  // create an entry map
  const entryMap = new Map();
  // loop through the block linked entries and add them to the map
  for (const entry of links.entries.block) {
    entryMap.set(entry.sys.id, entry);
  }

   // loop through the inline linked entries and add them to the map
  for (const entry of links.entries.inline) {
    entryMap.set(entry.sys.id, entry);
  }

  return {
    // other options...

    renderNode: {
      // other options...
      [INLINES.EMBEDDED_ENTRY]: (node:any, children:any) => {
        // find the entry in the entryMap by ID
        const entry = entryMap.get(node.data.target.sys.id);
        // render the entries as needed
        if (entry.__typename === "PageBlogPostContentLinks") {
			    return (
				    <img src={entry.block.image.url} alt="My image alt text" />
			    );
        }
      },
	  [BLOCKS.EMBEDDED_ENTRY]: (node:any, children:any) => {
      // find the entry in the entryMap by ID
        const entry = entryMap.get(node.data.target.sys.id);
        if (entry.__typename === "ComponentRichImage") {
          return (
            <Image
                alt={entry?.image.title || 'No description'}
                height={entry.image.height}
                src={entry?.image.url || '/placeholder.png'} // Add a fallback URL for the image
                width={entry.image.width}
                className="h-full w-full box-border"
              />
            );
        }
        // render the entries as needed by looking at the __typename
        // referenced in the GraphQL query
        if (entry.__typename === "CodeBlock") {
          return (
            <pre>
              <code>{entry.code}</code>
            </pre>
          );
        }

        if (entry.__typename === "VideoEmbed") {
          return (
            <iframe
            src={entry.embedUrl}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            title={entry.title}
            allowFullScreen={true}
            />
          );
        }
      },

      [BLOCKS.EMBEDDED_ASSET]: (node:any, next:any) => {
        // find the asset in the assetMap by ID
        const asset = assetMap.get(node.data.target.sys.id);

        // render the asset accordingly
        return (
          <Image src={asset.url} className="h-full w-full bg-teal-400" alt="My image alt text" />
        );
      },

	  [BLOCKS.PARAGRAPH]: (node:any, children:any) => {
        // find the asset in the assetMap by ID
       // const asset = assetMap.get(node.data.target.sys.id);

        // render the asset accordingly
        return (
          <p className="pt-5 pb-5 tracking-wide">{children}</p>
        );
      },
    },
  };
}

// Render pageBlogPost.content.json to the DOM using
// documentToReactComponents from "@contentful/rich-text-react-renderer"

export default function RichText(props:any) {
  const { document } = props;
  return <>{documentToReactComponents(document.json, renderOptions(document.links))}</>;
}
