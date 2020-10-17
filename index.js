const static = "https://static-links-page.signalnerve.workers.dev";
const avatar = "https://media-exp1.licdn.com/dms/image/C5603AQFRUptJAky-8w/profile-displayphoto-shrink_400_400/0?e=1608163200&v=beta&t=X3r0XWeWZYFEgr9jZUcyByMLt8I10Go_tQ5GwYkqNVQ";
const backgroundImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQL0Y7NoQVuGHnyTi0FukA-MttKln3scCfbPw&usqp=CAU";

const links = [
  { "name": "Favorite Website", "url": "https://www.nba.com/" },
  { "name": "Cloudflare Website", "url": "https://www.cloudflare.com/" },
  { "name": "A Useless Website", "url": "https://theuselessweb.com/" }
];

const socialLinks = [
	{ "url": "https://github.com/skidambi3", "svg": "https://simpleicons.org/icons/github.svg"},
	{ "url": "https://www.linkedin.com/in/saisaran-kidambi/", "svg": "https://simpleicons.org/icons/linkedin.svg"}
];

class LinksTransformer {
  constructor(links) {
    this.links = links;
  }
  
  async element(element) {
    this.links.forEach(link => {element.append(`<a href="${link.url}" target="_blank">${link.name}</a>`, {html: true});
						});
  }
}

class SocialTransformer {
	constructor(socialLinks) {
		this.socialLinks = socialLinks;
	}
  async element(element) {
    this.socialLinks.forEach(socialLink => {element.append(`<a href="${socialLink.url}" target="_blank"><img src="${socialLink.svg}"/></a>`, { html: true });
						});
  }
}

async function handleRequestJSON(request) {
	return new Response(JSON.stringify(links), 
			{ headers: { 'Content-type': 'application/json' } });
}

const rewritten = new HTMLRewriter()
			.on('div#links', new LinksTransformer(links))
			.on('div#profile', {element: e => e.removeAttribute('style')})
			.on('img#avatar', {element: e => e.setAttribute('src', avatar)})
			.on('h1#name', {element: e => e.setInnerContent("skidambi")})
			.on('title', {element: e => e.setInnerContent("Saisaran Kidambi")})
			.on('div#social', {element: e => e.removeAttribute('style')})
			.on("body", { element: e => e.setAttribute('style', `background: url(${backgroundImage}); background-size: cover;`) })
			.on('div#social', new SocialTransformer(socialLinks))

async function handleRequestHTML(request, link) {
	return new Promise((resolve, reject) => 
		{
			resolve(rewritten.transform(link));
		});
}

addEventListener('fetch', event => {
	event.respondWith(new Promise((resolve, reject) => {
		let url = new URL(event.request.url);
		if (url.pathname === "/links") {
			resolve(handRequestJSON(event.request));
		} else {
			fetch(static).then((result) => {resolve(handleRequestHTML(event.request, result));});
		}
	}));
})