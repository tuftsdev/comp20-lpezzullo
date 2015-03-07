
// Create instance of XHR object
xhr = new XMLHttpRequest();
// Set up the request
xhr.open("get", "http://tuftsdev.github.io/comp20-lpezzullo/messages/data.json", true);
// Set up handler for the response
xhr.onreadystatechange = parse;
// Execute the request
xhr.send();
function parse() {
	console.log("In my callback function " + xhr.readyState);
	if (xhr.readyState == 4 && xhr.status == 200) {
		alert("Got data back!");
		data = JSON.parse(xhr.responseText);
		//console.log(data);
		var result = "";
		for (i = 0; i < data.length; i++) {
			result += "<p>" + data[i]["content"] + " - " +  data[i]['username'] + "</p>";
		}
		document.getElementById("messages").innerHTML = result;
		//document.getElementById("messages").innerHTML = xhr.responseText;
	}
}
