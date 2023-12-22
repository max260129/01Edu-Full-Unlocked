document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const exerciseName = params.get('exercise');

    if (exerciseName) {
        console.log('Nom de l\'exercice récupéré :', exerciseName);
        // Vous pouvez maintenant utiliser exerciseName pour vos besoins
    } else {
        console.log('Nom de l\'exercice non spécifié dans l\'URL.');
    }
});
