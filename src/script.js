document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('content');
    const params = new URLSearchParams(window.location.search);
    const exerciseName = params.get('exercise'); // Récupérer le nom de l'exercice de l'URL

    if (!exerciseName) {
        contentDiv.innerHTML = 'Nom de l\'exercice non spécifié dans l\'URL.';
        return;
    }

    // Construire le chemin vers le fichier README.md
    const readmePath = `../data/subjects/${exerciseName}/README.md`;

    fetch(readmePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('README non trouvé');
            }
            return response.text();
        })
        .then(markdown => {
            // Convertir le markdown en HTML et l'afficher
            contentDiv.innerHTML = convertMarkdownToHTML(markdown);
        })
        .catch(error => {
            contentDiv.innerHTML = `Erreur lors du chargement du README : ${error.message}`;
        });
});

function convertMarkdownToHTML(markdown) {
    // Utiliser une bibliothèque de conversion Markdown en HTML ou écrire votre propre convertisseur
    // Exemple: return marked(markdown);
    return markdown; // Remplacer cette ligne par la conversion réelle
}