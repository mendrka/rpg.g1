 
// Menu déroulant logique
document.getElementById('menuBtn').onclick = function() {
    document.getElementById('sideMenu').classList.toggle('active');
};
// Fermer le menu si on clique ailleurs
document.addEventListener('click', function(e) {
    const menu = document.getElementById('sideMenu');
    const btn = document.getElementById('menuBtn');
    if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove('active');
    }
});

// --- Mémoire locale pour les publications ---
const STORAGE_KEY = 'rpg_posts';
const STORAGE_DATE_KEY = 'rpg_posts_date';
const postsDiv = document.getElementById('posts');

// Fonction pour afficher une publication
function renderPost(post, prepend = false) {
    const postDiv = document.createElement('div');
    postDiv.style.marginBottom = '20px';
    postDiv.style.background = '#e3f2fd';
    postDiv.style.padding = '12px';
    postDiv.style.borderRadius = '8px';

    if (post.fileURL) {
        if (post.fileType && post.fileType.startsWith('image/')) {
            postDiv.innerHTML += `<img src="${post.fileURL}" alt="Fichier" style="max-width:120px;max-height:120px;display:block;margin-bottom:8px;">`;
        } else {
            postDiv.innerHTML += `<a href="${post.fileURL}" download="${post.fileName}">Télécharger le fichier</a><br>`;
        }
    }
    postDiv.innerHTML += `<strong>${post.sender}</strong><br>${post.desc}`;
    if (prepend) {
        postsDiv.prepend(postDiv);
    } else {
        postsDiv.appendChild(postDiv);
    }
}

// Vérifie si 7 jours sont passés, sinon charge les posts
function checkAndLoadPosts() {
    const lastDate = localStorage.getItem(STORAGE_DATE_KEY);
    const now = Date.now();
    if (!lastDate || now - Number(lastDate) > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_DATE_KEY, now);
        return [];
    }
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    posts.forEach(post => renderPost(post));
    return posts;
}

let postsArray = checkAndLoadPosts();

document.getElementById('postForm').onsubmit = function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const desc = document.getElementById('descInput').value;
    const sender = document.getElementById('senderInput').value;

    let fileURL = '';
    let fileType = '';
    let fileName = '';
    if (fileInput.files[0]) {
        fileURL = URL.createObjectURL(fileInput.files[0]);
        fileType = fileInput.files[0].type;
        fileName = fileInput.files[0].name;
    }

    const post = {
        fileURL,
        fileType,
        fileName,
        desc,
        sender
    };

    postsArray.unshift(post);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postsArray));
    localStorage.setItem(STORAGE_DATE_KEY, Date.now());

    renderPost(post, true);

    // Reset form
    fileInput.value = '';
    document.getElementById('descInput').value = '';
    document.getElementById('senderInput').value = '';
};
