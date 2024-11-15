
(function(){
    const socket = io();
    socket.on('newPost', (post) => {//post creation event
        let blogsDiv= document.getElementById('blogsDiv')
        let div = document.createElement('div')
        div.innerHTML =`
            <div class="col-md-6 col-lg-4 mb-4">
                <a href="/blog/${post.id}" class="text-decoration-none text-dark">
                    <div class="card h-100 shadow-sm card-hover">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body.substring(0, 100)}...</p>
                            <h5 class="card-title">By ${post.authorName.name}</h5>
                        </div>
                    </div>
                </a>
            </div>
        `
        blogsDiv.append(div)
        console.log('New post received:', post);
    });
    const notificationList = document.getElementById('notifications');
    socket.on('likeNotification', (data) => {//like notification event
        const bgId ='l'+data.blogid
        let likeCountElement= document.getElementById(bgId)
        let likeCount = Number(likeCountElement.textContent)
        likeCountElement.innerHTML=likeCount+1
        const newNotification = document.createElement('div');
        newNotification.classList.add('alert', 'alert-info', 'alert-dismissible', 'fade', 'show');
        newNotification.setAttribute('role', 'alert');
        newNotification.innerHTML = `
            <a href="/blog/${data.blogid}" class="alert-link">
                <strong>${data.user.name}</strong> liked <strong>${data.title.substring(0, 20)}</strong>...</a>
            <a href="/blog/del/notify/${data.msgId}" class="btn-close" aria-label="Close"></a>`;
        notificationList.appendChild(newNotification);
        setTimeout(() => {
            newNotification.style.transition = 'opacity 0.5s ease';
            newNotification.style.opacity = '0';
            setTimeout(() => {
                newNotification.remove();
            }, 500); 
        }, 5000);  
    });
    socket.on('unliked',(data)=>{// unlike notification event
        const bgId ='l'+data.blogid
        let likeCountElement= document.getElementById(bgId)
        let likeCount = Number(likeCountElement.textContent)
        likeCountElement.innerHTML=likeCount-1
    })
    socket.on('updated',(data)=>{
        document.getElementById(data.id)?.remove()
    })
})()

