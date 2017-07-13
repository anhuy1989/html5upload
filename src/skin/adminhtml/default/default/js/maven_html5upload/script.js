/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/


	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		var m = $id("maven_messages");
		m.innerHTML = msg + m.innerHTML;
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {

			UploadFile(f);
		}

	}


	// output file information
	function ParseFile(file, cnttr) {
        if (file.type.indexOf("image") == 0) {
            var strcontent = 	"<p id='info_"+(cnttr - 1)+"'>File information: <strong>" + file.name +
                "</strong> type: <strong>" + file.type +
                "</strong> size: <strong>" + file.size +
                "</strong> bytes</p>";
        }
        else {
            var strcontent = 	"<p id='info_"+(cnttr - 1)+"' style='color:red;'><b>INCORRECT FILE TYPE</b>: File information: <strong>" + file.name +
                "</strong> type: <strong>" + file.type +
                "</strong> size: <strong>" + file.size +
                "</strong> bytes</p>"
        }

		Output(
            strcontent
		);

		// display an image
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
		}

	}


	// upload JPEG files
	function UploadFile(file) {

		// following line is not necessary: prevents running on SitePoint servers
		if (location.host.indexOf("sitepointstatic") >= 0) return

		var xhr = new XMLHttpRequest();
		if (xhr.upload && file.size <= $id("MAX_FILE_SIZE").value || parseInt($id("MAX_FILE_SIZE").value) == 0) {

			// create progress bar
			var o = $id("progress");
			var progress = o.appendChild(document.createElement("p"));
			progress.appendChild(document.createTextNode("upload " + file.name));


			// progress bar
			xhr.upload.addEventListener("progress", function(e) {
				var pc = parseInt(100 - (e.loaded / e.total * 100));
				progress.style.backgroundPosition = pc + "% 0";
			}, false);

			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					var response = JSON.parse(xhr.response);
					progress.className = (xhr.status == 200  ? "success" : "failed");
					if (response.error) {
						progress.className = 'failed';
					}
					if (typeof media_gallery_contentJsObject != 'undefined') {
                        var obj = new Object();
                        obj.creator = null;
                        var cnttr = document.getElementById('media_gallery_content_list').querySelectorAll('tr').length;
                        obj.id = 'file_'+(cnttr-1);
                        obj.name = 'test';
                        obj.response = xhr.response;
                        obj.size = 1234;
                        obj.status = 'full_complete';
                        var files = [obj];
                        Element.insert($('uploadBlocks'), {
                            bottom :'<div id="uploadBlock-'+(cnttr-1)+'"></div>'
                        });
                        media_gallery_contentJsObject.handleUploadComplete(files);
                    }

                    if (typeof MediabrowserInstance != 'undefined'){
                        MediabrowserInstance.handleUploadComplete();
                    }

					if (xhr.status == 200) {
						if (typeof media_gallery_contentJsObject != 'undefined'  && !response.error) {
							var spanremove = progress.appendChild(document.createElement("span"));
							spanremove.appendChild(document.createTextNode('Remove'));
							spanremove.setAttribute('class', 'remove-img');
							spanremove.setAttribute('data-path', response.path);
							spanremove.setAttribute('data-file', response.file);
							spanremove.setAttribute('data-cnt', cnttr - 1);

							var removeBtns = document.getElementsByClassName("remove-img");
							for (var i = 0, len = removeBtns.length; i < len; i++) {
								elm = removeBtns[i];
								elm.addEventListener("click", function () {
									var that = this;
									var xhr = new XMLHttpRequest();
									xhr.onreadystatechange = function (e) {
										if (xhr.readyState == 4) {
											var response = JSON.parse(xhr.response);
											if (response.success) {
												var cnt = that.getAttribute('data-cnt');
												document.getElementById('media_gallery_content-image-' + cnt).remove();
												that.parentElement.remove();
												$id('info_' + cnt).remove();
												if (typeof media_gallery_contentJsObject != 'undefined') {
													media_gallery_contentJsObject.idIncrement = media_gallery_contentJsObject.idIncrement - 1;
													var new_img_arr = [];
													for (var i = 0, len = media_gallery_contentJsObject.images.length; i < len; i++) {
														if (media_gallery_contentJsObject.images[i].file != that.getAttribute('data-file')) {
															new_img_arr.push(media_gallery_contentJsObject.images[i]);
														}
													}
													media_gallery_contentJsObject.images = new_img_arr;
													media_gallery_contentJsObject.updateImages();
												}

												if (typeof MediabrowserInstance != 'undefined') {
													MediabrowserInstance.handleUploadComplete();
												}
											}

										}
									};

									xhr.open('POST', $id("upload").getAttribute('data-remove-action'), true);
									xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
									xhr.send('path=' + this.getAttribute('data-path') + '&file=' + this.getAttribute('data-file'));
								});
							}
						}
						ParseFile(file, cnttr);
					}

				}
			};

			// start upload
			xhr.open("POST", $id("upload").action, true);
			xhr.setRequestHeader("X-File-Name", file.name);
			xhr.send(file);

		}

	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
			// remove submit button
			submitbutton.style.display = "none";
		}

	}
