
(function(){
    const socket = io();
    socket.on('newPost', (post) => {
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
})()
