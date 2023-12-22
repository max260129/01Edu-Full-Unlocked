document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('content');
    const params = new URLSearchParams(window.location.search);
    const exerciseName = params.get('exercise'); // Récupérer le nom de l'exercice de l'URL

    if (!exerciseName) {
        contentDiv.innerHTML = 'Nom de l\'exercice non spécifié dans l\'URL.';
        return;
    }

    if (exerciseName) {
        const auditLink = document.getElementById('auditLink');
        auditLink.href = `audit.html?exercise=${exerciseName}`;
    }

    const exerciseParts = exerciseName.split('.');

    if (exerciseParts.length == 1) {
        // Construire le chemin vers le fichier README.md
        const readmePath = `../data/subjects/${exerciseName}/README.md`;
        displayReadme(readmePath);   
    } else if (exerciseParts.length == 2) {
        // Construire le chemin vers le fichier README.md
        const readmePath = `../data/subjects/${exerciseParts[0]}/${exerciseParts[1]}/README.md`;
        displayReadme(readmePath);
    }

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
            // Replace ```console code blocks with <pre> tags to preserve formatting
            markdown = markdown.replace(/```console\n([\s\S]*?)```/g, '<pre class="console">$1</pre>');
            markdown = markdown.replace(/```\n([\s\S]*?)```/g, '<pre>$1</pre>');
            markdown = markdown.replace(/```sh\n([\s\S]*?)```/g, '<pre>$1</pre>');
            markdown = markdown.replace(/^## Markdown.*\n/gm, '');
            markdown = markdown.replace(/^## (?!Markdown|${exerciseName}).*$/gm, (match) => {
                return match.replace(/^## /, '### ');
            });
            //markdown = markdown.replace(/(```````````console\n)([\s\S]*?)\1/g, '<pre class="console">$2</pre>');
            markdown = markdown.replace(/(^`+console\n[\s\S]*?\n`+$)/gm, function(match) {
                // Remove the starting and ending backticks with "console"
                let codeBlock = match.replace(/^`+console\n/gm, '').replace(/\n`+$/gm, '');
                // Return as a preformatted text block
                return '<pre class="console">' + codeBlock + '</pre>';
            });

            // Parse the Markdown to HTML
            let htmlContent = marked.parse(markdown);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            // Find and update image paths
            const images = tempDiv.querySelectorAll('img');
            images.forEach(image => {
                const imagePath = image.getAttribute('src');
                const newPath = new URL(imagePath, new URL(filePath, window.location.href)).href;
                image.setAttribute('src', newPath);
            });

            // Process blockquote elements
            const blockquotes = tempDiv.querySelectorAll('blockquote');
            blockquotes.forEach(blockquote => {
                const p = document.createElement('p');
                while (blockquote.firstChild) {
                    p.appendChild(blockquote.firstChild);
                }
                blockquote.parentNode.replaceChild(p, blockquote);
            });

            // Set the innerHTML of the readme container
            document.querySelector('.readme').innerHTML = tempDiv.innerHTML;
        })
        .catch(error => {
            console.error('Error fetching the README:', error);
        });
}  