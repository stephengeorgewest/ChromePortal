
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById("resetPortal").addEventListener("click", resetPortal);
	document.getElementById("activatePortalAntenna").addEventListener('click',  activatePortalAntenna);
	document.getElementById("restartPolling").addEventListener('click',  myDevicePoll);
	document.getElementById("color").addEventListener("change", changeColor);
	myText = document.getElementById("mytext");
});
