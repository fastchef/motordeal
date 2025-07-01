document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('message').value;

    try {
        const response = await fetch('/.netlify/functions/guardarResena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, mensaje })
        });

        if (response.ok) {
            alert('¡Reseña enviada correctamente!');
            document.getElementById('reviewForm').reset();
        } else {
            alert('Error al enviar la reseña.');
        }
    } catch (error) {
        alert('Error de conexión al enviar la reseña.');
    }
});