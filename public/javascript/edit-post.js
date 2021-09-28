async function editHandler() {
	const id = await document.querySelector("#edit-id").textContent;

	numId = parseInt(id);

	const data = {
		id: numId,
		title: document.querySelector("#title").value,
		post_content: document.querySelector("#post-content").value,
	};

	const response = await fetch(`/api/posts/edit`, {
		method: "PUT",
		body: JSON.stringify({
			id: numId,
			title: document.querySelector("#title").value,
			post_content: document.querySelector("#post-content").value,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(response.statusText);
	}
}
