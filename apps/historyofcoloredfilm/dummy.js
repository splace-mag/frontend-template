function dummy_startup() {
	console.log('Started');
}

	function loadImage(target, imgSrc, width, height){
			var def = new $.Deferred();
			//Resize Loaded Image:
			var img = new Image();
			img.onload = function () {
				target.height = height; //target height
				target.width = width; //target width
				var hRatio = img.height/target.height;
				var wRatio = img.width/target.width;
					
				var oc = document.createElement('canvas'), //create temporary canvas to work with
				octx = oc.getContext('2d');
				//document.getElementById('splaceApp').appendChild(oc); //debug
				oc.width = img.width;
				oc.height = img.height;
				octx.drawImage(img, 0, 0, oc.width, oc.height);
				
				var ocw = oc.width,	//scaled width
				och = oc.height,	//scaled height
				ocwt = ocw,			//scaled width one iteration back
				ocht = och;			//scaled height one iteration back
			
				if(wRatio>hRatio){ 	//if we have to focus on width or height to get a more accurate result
					if(img.width > w){ //if the image.width is greater than target.width
						while(ocw>target.width){
							octx.drawImage(oc, 0, 0, ocwt, ocht, 0,0,ocw,och);
							//console.log("Drawing with w:"+ocw+" h:"+och);
							ocwt = ocw;
							ocht = och;
							ocw=ocw*0.8;
							och=och*0.8;
						}		
					}else if(img.width<target.width){	//if the image.width is smaller than the target.width
						while(ocw>target.width){
							octx.drawImage(oc, 0, 0, ocwt, ocht, 0,0,ocw,och);
							//console.log("Drawing with w:"+ocw+" h:"+och);
							ocwt = ocw;
							ocht = och;
							ocw=ocw*1.2;
							och=och*1.2;
						}
					}else{
						//if image.width == target.width do nothing 
					}
				}else{ //we have to focus on height or the scales are the same (so we could either focus width or height)
					if(img.height > h){ //if the image.height is greater than target.height
						while(och>target.height){
							octx.drawImage(oc, 0, 0, ocwt, ocht, 0,0,ocw,och);
							//console.log("Drawing with w:"+ocw+" h:"+och);
							ocwt = ocw;
							ocht = och;
							ocw=ocw*0.8;
							och=och*0.8;
						}		
					}else if(img.height<target.height){	//if the image.width is smaller than the target.width
						while(och>target.height){
							octx.drawImage(oc, 0, 0, ocwt, ocht, 0,0,ocw,och);
							//console.log("Drawing with w:"+ocw+" h:"+och);
							ocwt = ocw;
							ocht = och;
							ocw=ocw*1.2;
							och=och*1.2;
						}
					}else{
						//if image.width == target.width do nothing 
					}
				}
				ctx.drawImage(oc, 0, 0, ocwt, ocht,0,0,target.width,target.height);	//Draw the nearest possible approximation in the target canvas
				def.resolve();
			}
			img.src = imgSrc;
			return def.promise();
		}
		
function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function dummy_teardown() {
	console.log('Nothing to do here, move along');
}

