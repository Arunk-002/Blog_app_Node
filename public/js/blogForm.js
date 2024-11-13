const form = document.getElementById('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this blog?",
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            form.submit(); 
        }
    });
});

