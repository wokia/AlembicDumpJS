interface HtmlDocuments {
	[index: string]: string;
}

interface Window {
	__html__ : HtmlDocuments;
}
