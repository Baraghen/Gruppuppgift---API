    // All the templates that are used

const views = {
    login: ['#loginFormTemplate', '#registerFormTemplate'],
    loggedIn: ['#entryFormTemplate', '#menuTemplate'],
    editPost: ['#editPostFormTemplate'],
    editComment: ['#editCommentFormTemplate'],
    readGuest: ['#readPost'],
    readLoggedIn: ['#commentFormTemplate'],
}
    // All selectors for the different eventlisteners

const bindEvents = () => {
    const loginForm =  document.querySelector('#loginForm')
    const registerForm =  document.querySelector('#registerForm')
    const createEntryForm =  document.querySelector('#createEntryForm')
    const editEntryForm = document.querySelector('#editEntryForm')
    const createCommentForm = document.querySelector('#createCommentForm')
    const editCommentForm = document.querySelector('#editCommentForm')
    const myPostBtn = document.querySelector('#myPostBtn')
    const allPostBtn = document.querySelector('#allPostBtn')
    const allUserBtn = document.querySelector('#allUserBtn')

    if(loginForm !== null){
        loginForm.addEventListener('submit', event => {
            event.preventDefault()
            // Code for user login
            const formData = new FormData(loginForm)
            fetch('http://localhost/uppgift3/public/index.php/api/login', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    document.getElementById("loginMessage").innerHTML = "Incorrect user/password combination, try again!";
                } else {
                    return response.json()
                }
            })
            .then(data =>{
                localStorage.setItem("username", data.username);
                localStorage.setItem("userID", data.userID);
                renderView(views.loggedIn)

            })
        })
    }
    if(registerForm !== null){
        registerForm.addEventListener('submit', event => {
            event.preventDefault()
            // Code for registering user

            const formData = new FormData(registerForm)
            fetch('http://localhost/uppgift3/public/index.php/api/register', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    document.getElementById("regMessage").innerHTML = "User already exists!";
                } else {
                    document.getElementById("regMessage").innerHTML = "User has been created!";
                }
            })
        })
    }
    if(createEntryForm !== null){
        createEntryForm.addEventListener('submit', event => {
            event.preventDefault()
            // Code for post entry

            const formData = new FormData(createEntryForm)
            fetch('http://localhost/uppgift3/public/index.php/entry', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    document.getElementById("entryMessage").innerHTML = "Something went wrong, try again?";
                } else {
                    document.getElementById("entryMessage").innerHTML = "Your post has been sent!";
                }
            })
        })
    }
    if(editEntryForm !== null){
        editEntryForm.addEventListener('submit', event => {
            event.preventDefault()
            // Code for updating entry

            const formData = new FormData(editEntryForm)
            const object = {};
            formData.forEach((value, key) =>
            {object[key] = value});
            const json = JSON.stringify(object)

            fetch('http://localhost/uppgift3/public/index.php/entry/'+localStorage.getItem("entryID"), {
                method: 'PUT',
                body: json,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                } else {
                    renderView(views.loggedIn);
                }
            })
        })
    }
    if(createCommentForm !== null){
        createCommentForm.addEventListener('submit', event => {
            event.preventDefault()
            // Code for adding comments

            const formData = new FormData(createCommentForm)
            formData.append('entryID', localStorage.getItem("entryID"))
            fetch('http://localhost/uppgift3/public/index.php/comment', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                } else {
                    viewPost(localStorage.getItem("entryID"))
                }
            })
        })
    }
    if(editCommentForm !== null){
        editCommentForm.addEventListener('submit', event => {
            event.preventDefault()
            // Code for updating comments

            const formData = new FormData(editCommentForm)
            const object = {};
            formData.forEach((value, key) =>
            {object[key] = value});
            const json = JSON.stringify(object)

            fetch('http://localhost/uppgift3/public/index.php/comment/'+localStorage.getItem("commentID"), {
                method: 'PUT',
                body: json,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                } else {
                    viewPost(localStorage.getItem("entryID"))
                }
            })
        })
    }
    if(myPostBtn !== null){
        // This is for populating the page with the users posts
        myPostBtn.addEventListener('click', event => {
            fetch('http://localhost/uppgift3/public/index.php/entries/'+localStorage.getItem("userID"), {
                method: 'GET',
            })
            .then(response => {
                return response.json();
                    })
                    .then(data => {
                        const target = document.querySelector('#entryList');
                        target.innerHTML = "";
                        const div = document.createElement('div');
                        div.setAttribute('id', 'entries')
                        let output = '<h1 class="display-4 mb-4 mt-4 text-center">My Posts</h1>'
                        data.forEach(entry =>{
                            output += `
                            <div class="card mb-3" id="${entry.entryID}">
                                <div class="card-body">
                                    <h5 class="card-title">${entry.title}</h5>
                                    <p class="card-text summary">${entry.content}</p>
                                    <p>${entry.createdAt}</p>
                                    <button onclick="deletePost(${entry.entryID})" class="btn btn-danger">Delete</button>
                                    <button onclick="editPost(${entry.entryID})" class="btn btn-info">Edit</button>
                                    <button onclick="viewPost(${entry.entryID})" class="btn btn-success">Read</button>
                                </div>
                            </div>
                            `;
                        })
                        div.innerHTML = output;
                        target.append(div)
                    })
        })
    }
    if(allPostBtn !== null){
        // This is for populating the page with all of the stored posts
        allPostBtn.addEventListener('click', event => {
            fetch('http://localhost/uppgift3/public/index.php/entries/all', {
                method: 'GET',
            })
            .then(response => {
                return response.json();
                    })
                    .then(data => {
                        const target = document.querySelector('#entryList');
                        target.innerHTML = "";
                        const div = document.createElement('div');
                        div.setAttribute('id', 'entries')
                        let output = '<h1 class="display-4 mb-4 mt-4 text-center">All Posts</h1>'
                        data.forEach(entry =>{
                            if(entry.createdBy == localStorage.getItem("userID")){
                                output += `
                            <div class="card mb-3" id="${entry.entryID}">
                                <div class="card-body">
                                    <h5 class="card-title">${entry.title}</h5>
                                    <p class="card-text summary">${entry.content}</p>
                                    <p>${entry.createdAt}</p>
                                    <button onclick="deletePost(${entry.entryID})" class="btn btn-danger">Delete</button>
                                    <button onclick="editPost(${entry.entryID})" class="btn btn-info">Edit</button>
                                    <button onclick="viewPost(${entry.entryID})" class="btn btn-success">Read</button>
                                </div>
                            </div>
                            `;
                            }else{
                            output += `
                            <div class="card mb-3" id="${entry.entryID}">
                                <div class="card-body">
                                    <h5 class="card-title">${entry.title}</h5>
                                    <p class="card-text summary">${entry.content}</p>
                                    <p>${entry.createdAt}</p>
                                    <button onclick="viewPost(${entry.entryID})" class="btn btn-success">Read</button>
                                </div>
                            </div>
                            `;
                            }
                        })
                        div.innerHTML = output;
                        target.append(div)
                    })
        })
    }
    if(allUserBtn !== null){
        // This is for populating the page with all the stored users
        allUserBtn.addEventListener('click', event => {
            fetch('http://localhost/uppgift3/public/index.php/user/all', {
                method: 'GET',
            })
            .then(response => {
                return response.json();
                    })
                    .then(data => {
                        const target = document.querySelector('#entryList');
                        target.innerHTML = "";
                        const ul = document.createElement('ul');
                        ul.setAttribute('id', 'entries')
                        ul.setAttribute('class', 'list-group mb-4')
                        let output = '<h1 class="display-4 mb-4 mt-4 text-center">All Users</h1>'
                        data.forEach(entry =>{
                            output += `
                            <li class="list-group-item">${entry.username}</li>
                            `;
                        })
                        ul.innerHTML = output;
                        target.append(ul)
                    })
        })
    }
}

function renderView(view) {
	// Definera ett target
	const target = document.querySelector('main')

	// Rensa innehållet eftersom innehållet bara växer om vi kör flera renderView()
	target.innerHTML = ''

	// Loopa igenom våran "view"
	view.forEach(template => {
		// Hämta innehållet i templaten
		const templateMarkup = document.querySelector(template).innerHTML

		// Skapa en div
		const div = document.createElement('div')

		// Fyll den diven med innehållet
		div.innerHTML = templateMarkup

		// Lägg in den diven i target (main-elementet)
		target.append(div)
        
    })
    bindEvents();
}
function deletePost(id){
    // Removes a single post
    const post = document.getElementById(id);
    post.parentElement.removeChild(post);
    fetch('http://localhost/uppgift3/public/index.php/entry/'+id, {
        method: 'DELETE'
    })
}
function deleteComment(id){
    // Removes a single comment
    const comment = document.getElementById(id);
    comment.parentElement.removeChild(comment);
    fetch('http://localhost/uppgift3/public/index.php/comment/'+id, {
        method: 'DELETE'
    })
}
function editPost(id){
    // This function takes you to the edit entry form
    localStorage.setItem("entryID", id)
    renderView(views.editPost)
}
function editComment(id){
    // This function takes you to the edit comment form 
    localStorage.setItem("commentID", id)
    renderView(views.editComment)
}
function viewPost(id){
    // This function loads a single entry for a full view as well as populates the page with any connected comments
    localStorage.setItem("entryID", id)
    if(localStorage.getItem("username") == null){
        renderView(views.readGuest)
    }else{
        renderView(views.readLoggedIn)
    }

    var post =
    fetch('http://localhost/uppgift3/public/index.php/entry/'+id, {
        method: 'GET'
    }).then(response =>{
        return response.json()
    });

    var comment =
    fetch('http://localhost/uppgift3/public/index.php/comments/'+id, {
        method: 'GET'
    }).then(response =>{
        return response.json()
    });

    var combinedData = {"post":{}, "comment":{}};
    Promise.all([post, comment]).then(values =>{
        combinedData["post"] = values[0];
        combinedData["comment"] = values[1];
        return combinedData;
    }).then(function(){

        const target1 = document.querySelector('#currentPost');
            target1.innerHTML = "";
            target1.innerHTML = `
                <h1 class="display-4 mb-4 mt-4 text-center">${combinedData.post.title}</h1>
                <p>${combinedData.post.content}</p>
            `;
        
        const target2 = document.querySelector('#commentList');
            target2.innerHTML = "";
            let output = '<h4 class="mb-4 mt-4 text-center">Comments</h4>';
            combinedData.comment.forEach(entry=>{
                if(localStorage.getItem("userID") == entry.createdBy){
                    output += `
                    <div class="card mb-3" id="${entry.commentID}">
                        <div class="card-body">
                            <p class="card-text summary">${entry.content}</p>
                            <p>${entry.createdAt}</p>
                            <button onclick="deleteComment(${entry.commentID})" class="btn btn-danger">Delete</button>
                            <button onclick="editComment(${entry.commentID})" class="btn btn-info">Edit</button>
                        </div>
                    </div>
                `;
                }else{
                    output += `
                    <div class="card mb-3" id="${entry.commentID}">
                        <div class="card-body">
                            <p class="card-text summary">${entry.content}</p>
                            <p>${entry.createdAt}</p>
                        </div>
                    </div>
                `;
            }
            target2.innerHTML = output;

            })
    })
}
function logout(){
    // This function is for logging out
    localStorage.clear();
    window.location.href = "http://localhost/uppgift3/src/views/logout.php";
}
function checkLogin(){
    // This function checks if you're logged in or not and redirects you to the proper page
    fetch('http://localhost/uppgift3/public/index.php/api/ping', {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    renderView(views.login)
                    fetch('http://localhost/uppgift3/public/index.php/index/entries/20', {
                        method: 'GET'
                    })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        const target = document.querySelector('main');
                        const div = document.createElement('div');
                        div.setAttribute('id', 'entries')
                        let output = '<h1 class="display-4 mb-4 mt-4 text-center">Senaste Inlägg</h1>'
                        data.forEach(entry =>{
                            output += `
                            <div class="card mb-3" id="${entry.entryID}">
                                <div class="card-body">
                                    <h5 class="card-title">${entry.title}</h5>
                                    <p class="card-text summary">${entry.content}</p>
                                    <p>${entry.createdAt}</p>
                                    <button onclick="viewPost(${entry.entryID})" class="btn btn-success">Read</button>
                                </div>
                            </div>
                            `;
                        })
                        div.innerHTML = output;
                        target.append(div)
                    })
                } else {
                    renderView(views.loggedIn)
                }
            })
}

checkLogin();