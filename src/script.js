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
    displayReadme(readmePath);

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

// Include marked.js in your HTML file before this script
// or install it via npm if you're using a build system

// Function to fetch and display a README.md file
function displayReadme(filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(markdown => {
        // Replace blockquote syntax with normal text
        let htmlContent = marked.parse(markdown);
        

        // Then parse the Markdown to HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        // Find all images in the readmeContainer and update their paths
        const images = tempDiv.querySelectorAll('img'); // Corrected selector
        images.forEach(image => {
            const imagePath = image.getAttribute('src');
            // Assuming the media files are in the same directory as the README.md
            const newPath = new URL(imagePath, new URL(filePath, window.location.href)).href;
            image.setAttribute('src', newPath);
        });

          // Find all blockquote elements
          const blockquotes = tempDiv.querySelectorAll('blockquote');
          blockquotes.forEach(blockquote => {
            // Create a new paragraph element
            const p = document.createElement('p');
            
            // Move all children of the blockquote to the new paragraph
            while (blockquote.firstChild) {
              p.appendChild(blockquote.firstChild);
            }
            
            // Replace blockquote with the new paragraph
            blockquote.parentNode.replaceChild(p, blockquote);
          });
          

          document.querySelector('.readme').innerHTML = tempDiv.innerHTML;

        // Add additional processing if needed...
      })
      .catch(error => {
        console.error('Error fetching the README:', error);
      });
}


  