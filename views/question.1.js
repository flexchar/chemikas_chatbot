module.exports.default = question => ({
	attachment: {
		type: 'template',
		payload: {
			template_type: 'generic',
			elements: [
				{
					title: 'Klausimas!',
					image_url:
						'https://chemikas.lt/images/photoalbum/album_17/math_1.jpg',
					subtitle: question.text,
					default_action: {
						type: 'web_url',
						url: 'https://chemikas.lt/',
						messenger_extensions: true,
						webview_height_ratio: 'tall',
						fallback_url: 'https://chemikas.lt/'
					},
					buttons: [
						{
							type: 'web_url',
							url: 'https://chemikas.lt/',
							title: 'Chemikas.lt'
						},
						{
							type: 'postback',
							title: `ID ${question.id}`,
							payload: question.id
						}
					]
				}
			]
		}
	}
});
