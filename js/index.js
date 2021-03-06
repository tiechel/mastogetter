function $(id) {
	return document.getElementById(id);
}

function showPreview() {
	let instance_full = $("instance").value;
	if (instance_full.trim() == "") {
		instance_full = "https://qiitadon.com";
		$("instance").value = instance_full;
	}
	const instance = instance_full.split("//")[1];
	const toot_id = $("toot-id").value.split("/").reverse()[0];
	const toot_url = instance_full + "/api/v1/statuses/" + toot_id;
	const target_div = $("card-preview");

	const xhr = new XMLHttpRequest();
	xhr.open("GET", toot_url, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const toot = JSON.parse(xhr.responseText);
				const timestamp = moment(toot.created_at).format('llll');
				let media = "";
				for (let i = 0; i < toot.media_attachments.length; i++) {
					media += `<a href='${toot.media_attachments[i].url}'><img class='thumbs' src='${toot.media_attachments[i].preview_url}'></a>`;
				}
				target_div.innerHTML = `
<div class="toot">
<div class="box"><a href="${toot.account.url}" target="_blank"><img width="48" height="48" alt="" class="u-photo" src="${toot.account.avatar}"></a></div>
<div class="box"><a class="display-name" href="${toot.account.url}" target="_blank">${toot.account.display_name}<span>@${toot.account.username}@${instance}</span></a>
<a class="toot-time" href="${toot.url}" target="_blank">${timestamp}</a>
<div class="e-content" lang="ja" style="display: block; direction: ltr"><p>${toot.content}</p></div>
${media}</div>
</div>
`;
			} else {
				console.error(xhr.statusText);
			}
		}
	};
	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};
	xhr.send(null);
}

function addCard() {
	const clone = $("card-preview").firstElementChild.cloneNode(true);
	clone.setAttribute("id", max_index);
	clone.setAttribute("ondblclick", "deleteCard('"+ max_index +"')");
	card_list[max_index] = $("toot-id").value.split("/").reverse()[0];
	max_index++;

	$("cards").appendChild(clone);
	genPermalink();
}

function deleteCard(index) {
	$("cards").removeChild($(index));
	delete card_list[index];
	genPermalink();
}

function copyPermalink() {
	if (isEmptyPermalink()) {
		alertUsageNoPermalink();
		return false;
	}
	genPermalink();
	$("permalink").select();
	document.execCommand("copy");
}

function loadPermalink() {
	const permalink = $("load").value;
	const permalink_str = {"i": permalink.split("?i=")[1].split("&")[0],
						 "t": permalink.split("&t=")[1]};
	const permalink_obj = decodePermalink(permalink_str);

	showCards(permalink_obj);
	genPermalink(permalink_obj.toot_ids.join(","));
}

function alertUsageGitIO() {
	alert("パーマリンクがコピーされました。\nこのあと https://git.io/xxxx 形式の短縮 URL を作成するため別ウィンドウがポップアップします。開かれた先に表示された値が URL の xxxx の部分になります。");
}

function alertUsageNoPermalink() {
	alert("まとめられたリンクがありません。");
}

function isEmptyPermalink() {
	return (!$("permalink").value) ? true : false;
}

function submitGitIO() {
	$("form-gitio").submit();
}
