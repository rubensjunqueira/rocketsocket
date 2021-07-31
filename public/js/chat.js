const socket = io('http://localhost:3000');
let idChatRoom = '';
const avatarUrl = `https://ui-avatars.com/api/?background=random&name=`;

function onLoad() {
	const urlParmas = new URLSearchParams(window.location.search);

	const name = urlParmas.get('name');
	const email = urlParmas.get('email');
	const avatar_url = urlParmas.get('avatar');

	document.querySelector('.user_logged').innerHTML += `
		<img 
			class="avatar_user_logged"
			src="${validateUrl(avatar_url) || avatarUrl + name}"
		</img>
		<strong id="user_logged">${name}</strong>
	`

	socket.emit("start", {
		name,
		email,
		avatar_url: avatar_url || avatarUrl + name
	});

	socket.on('new_users', user => {
		const existsInDiv = document.getElementById(`user_${user._id}`)

		if (!existsInDiv)
			addUser(user);
	});

	socket.emit('get_users', users => {
		users.map(x => {
			if (x.email !== email) {
				addUser(x);
			}
		})
	});

	socket.on('message', data => {
		if (data.message.roomId === idChatRoom)
			addMessage(data);
	});

	socket.on('notification', data => {
		if (data.roomId !== idChatRoom) {
			const user = document.getElementById(`user_${data.from._id}`);

			user.insertAdjacentHTML('afterbegin', `
			<div class="notification"></div>
			`);
		}
	});
}

onLoad();

function addMessage(data) {
	const divMessageUser = document.getElementById('message_user');

	divMessageUser.innerHTML += `
	<span class="user_name user_name_date">
	<img
	class="img_user"
	src="${data.user.avatar_url}"
	/>
	<strong>${data.user.name} &nbsp; </strong>
	<span> 	${dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm')}</span>
	</span
	<div class="messages">
	<span class="chat_message">${data.message.text}</span>
    </div>
	`
	scrollToDown();
}

function addUser(user) {
	const userList = document.getElementById('users_list');

	userList.innerHTML += `
	<li
		class="user_name_list"
		id="user_${user._id}"
		idUser="${user._id}"
  	>
	<img
	  class="nav_avatar"
	  src="${user.avatar_url}"
	/>
	${user.name}
  </li>
	`
}

document.getElementById('users_list').addEventListener('click', event => {
	const inputMessage = document.querySelector('#user_message');
	inputMessage.classList.remove('hidden');

	document.getElementById('message_user').innerHTML = '';

	document.querySelectorAll('li.user_name_list').forEach(item => {
		item.classList?.remove('user_in_focus');
	});


	if (event.target && event.target.matches('li.user_name_list')) {
		const idUser = event.target.getAttribute('idUser');

		event.target.classList.add('user_in_focus');

		const notification = document.querySelector(`#user_${idUser} .notification`);

		notification?.remove();

		socket.emit('start_chat', { idUser }, (response) => {
			idChatRoom = response.room.idChatRoom;

			response.messages.forEach(message => {
				const data = {
					message,
					user: message.to
				};

				addMessage(data);
			});
		});
	}
});

document.getElementById('user_message').addEventListener('keypress', event => {
	if (event.key === 'Enter') {
		const message = event.target.value;

		socket.emit("message", {
			idChatRoom,
			message
		});

		event.target.value = "";
	}
});

function scrollToDown() {
	const divMessageUser = document.getElementById('message_user');
	divMessageUser.scrollTop = divMessageUser.scrollHeight;
}

function validateUrl(url) {
	try {
		if (!url) return false;
		new URL(url);
	} catch (e) {
		console.log(e);
		return false;
	}
	return true;
}