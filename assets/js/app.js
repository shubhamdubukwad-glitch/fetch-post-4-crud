var cl = console.log;

const postForm = document.getElementById('postForm')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userID = document.getElementById('userID')
const addpostBtn = document.getElementById('addpostBtn')
const updatepostBtn = document.getElementById('updatepostBtn')
const postContainer = document.getElementById('postContainer')

const BASE_URL = `https://shubham-92216-default-rtdb.asia-southeast1.firebasedatabase.app`;
const POST_URL = `${BASE_URL}/post.json`;

const state = {
    postArr: [],
    EDIT_ID: null,
}

//read-post//
function reatPost(arr) {
    let result = ``;
    arr.forEach(post => {
result += `<div class="col-md-3 mt-5 mb-5" id="${post.id}">
                <div class="card h-100">
                    <div class="card-header bg-info">
                        <h1>${post.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                       <button onclick="editpost(this)" type="button" class="btn btn-primary">Edit</button>
                        <button onclick="removepost(this)" type="button" class="btn btn-danger">Remove</button>
                    </div>
                </div>
            </div>`;
    });
    postContainer.innerHTML = result;
}

function fetchpost() {
    fetch(POST_URL, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..?')
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key;
                state.postArr.unshift(data[key]);
            }
            reatPost(state.postArr)
        })
        .catch(err => {
            cl(err)
        })
}
fetchpost()

//create-post//
function onaddPost(eve) {
    eve.preventDefault()
    let postObj = {
        title: title.value,
        body: body.value,
        userID: userID.value
    }
    fetch(POST_URL, {
        method: "POST",
        body: JSON.stringify(postObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..?')
            }
            return res.json()
        })
        .then(data => {
            postObj.id = data.name;
            let col = document.createElement('div');
            col.className = `col-md-3 mt-5 mb-5`;
            col.id = postObj.id;
            col.innerHTML = ` <div class="card h-100">
                    <div class="card-header bg-info">
                        <h1>${postObj.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${postObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editpost(this)" type="button" class="btn btn-primary">Edit</button>
                        <button onclick="removepost(this)" type="button" class="btn btn-danger">Remove</button>
                    </div>
                </div>`;
            postContainer.prepend(col)
            postForm.reset()

            Swal.fire({
                title: "POST CREATED SUCCESSFULLY..!!",
                text: "You post card created has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
}
//edit-post//
function editpost(ele) {
    let edit_id = ele.closest('.col-md-3').id;
    //cl(edit_id)
    state.EDIT_ID = edit_id;
    let edit_url = `${BASE_URL}/post/${edit_id}.json`;

    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/josn",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            title.value = data.title;
            body.value = data.body,
                userID.value = data.userID,

                addpostBtn.classList.add('d-none');
            updatepostBtn.classList.remove('d-none');
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
        })
}
//delete-post//
function removepost(ele) {
    let deleteid = ele.closest('.col-md-3').id;
    //cl(deleteid)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${BASE_URL}/post/${deleteid}.json`;
            fetch(delete_url, {
                method: "DELETE",
                body: null,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "TOKEN JWT FROM LS"
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('somthing went wrong..?')
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = state.postArr.findIndex(p => p.id === deleteid)
                    state.postArr.splice(getIndex, 1);
                    ele.closest('.col-md-3').remove();

                    Swal.fire({
                        title: "Post Deleted successfully..!",
                        text: "Your post deleted has been deleted.",
                        icon: "success",
                        timer: 4000
                    });
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                })
        }
    });
}
//update-post//
function onupdatepost() {
    let updateId = state.EDIT_ID;
    let update_url = `${BASE_URL}/post/${updateId}.json`;
    let updateObj = {
        title: title.value,
        body: body.value,
        userID: userID.value
    }
    fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(updateObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            let col = document.getElementById(updateId);
            col.innerHTML = ` <div class="card h-100">
                <div class="card-header bg-info">
                    <h1>${updateObj.title}</h1>
                </div>
                <div class="card-body">
                    <p>${updateObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editpost(this)" type="button" class="btn btn-primary">EDIT</button>
                    <button onclick="removepost(this)" type="button" class="btn btn-danger">REMOVE</button>
                </div>
            </div>`;

            addpostBtn.classList.remove('d-none');
            updatepostBtn.classList.add('d-none');
            postForm.reset()
            Swal.fire({
                title: "POST UPDATED SUCCESSFULLY!",
                text: "Your post updated has been successfully!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
        })
}
postForm.addEventListener('submit', onaddPost)
updatepostBtn.addEventListener('click', onupdatepost)