Dropzone.options.dzone = {
	paramName: 'filetoupload',
	maxFilesize: 20,
	acceptedFiles: "image/*",
	clickable: true,
	init: function() {
		this.on('success', function(file, response) {
		    file.previewTemplate.setAttribute('onclick', 'window.open(\"' + response + '\", \"_blank\");');
		});
	},
};
