$(document).ready(function() {
    $('#register-form').submit(function(e) {
        e.preventDefault();
        
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();
        
        $.ajax({
            url: 'http://localhost:3000/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name, email, password }),
            success: function(response) {
                alert('Account created successfully! You can now log in.');
                window.location.href = 'index.html';
            },
            error: function(xhr, status, error) {
                alert('Registration failed: ' + xhr.responseJSON.message);
            }
        });
    });
});