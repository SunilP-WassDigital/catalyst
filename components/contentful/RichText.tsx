import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
type RichTextProps = {
	document: RichTextDocument | null
}


function RichText({ document }: RichTextProps) {
	if (!document) {
		return null
	}

	//return <>{documentToHtmlString(document)}</>
	return <>{documentToReactComponents(document)}</>
}

export default RichText