const API_KEY = '6cdd2ecd-9842-4d7c-ae2b-d794df4f452e';

const API = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});

API.defaults.headers.common["X-API-KEY"] = API_KEY;

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&page=2';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

let refreshBtn = document.querySelector('.refreshBtn');
refreshBtn.addEventListener('click', loadRandomCats);


const spanError = document.querySelector('#error');

async function loadRandomCats() {
    // const res = await fetch(API_URL_RANDOM);
    // const data = await res.json();
    
    const {data, status} = await API.get('images/search?limit=3&page=2');

    console.log('Random');
    console.log(data);

    if (status !== 200) {
        spanError.innerHTML = `There was an error loading random cats: ${status} ${data.message}`
    } else {
        const img1 = document.querySelector('#img1');
        const img2 = document.querySelector('#img2');
        const img3 = document.querySelector('#img3');

        let btn1 = document.getElementById('btn1');
        let btn2 = document.getElementById('btn2');
        let btn3 = document.getElementById('btn3');
        
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavoriteCat(data[0].id);
        btn2.onclick = () => saveFavoriteCat(data[1].id);
        btn3.onclick = () => saveFavoriteCat(data[2].id);          
    }
}

async function loadFavoriteCats() {
    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'GET',
    //     headers: {
    //         'X-API-KEY': API_KEY
    //     }
    // });
    // const data = await res.json();

    const {data, status} = await API.get('/favourites');

    console.log('Favourties');
    console.log(data);

    if (status !== 200) {
        spanError.innerHTML = `There was an error loading favorite cats: ${status} ${data.message}`
    } else {
        const section = document.querySelector('#favoriteCats');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorite Cats');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(cat => {    
            const article = document.createElement('article');
            const img = document.createElement('img');
            const button = document.createElement('button');
            const btnText = document.createTextNode('Remove cat from favorites');

            button.appendChild(btnText);
            img.src = cat.image.url;

            button.onclick = () => deleteFavoriteCat(cat.id);

            article.appendChild(img);
            article.appendChild(button);

            section.appendChild(article);
        });
    }
}   

async function saveFavoriteCat(id) {
    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-API-KEY': API_KEY
    //     },
    //     body: JSON.stringify({
    //         image_id: id,
    //     })
    // });

    // const data = await res.json();

    const {data, status} = await API.post('/favourites', {
        image_id: id,
    });

    if (status !== 200) {
        spanError.innerHTML = `There was an error saving the cat in favorites: ${status} ${data.message}`
    } else {
        console.log('Cat saved in favorites');
        loadFavoriteCats();
    }

    // console.log('Save');
    // console.log(res);
}

async function deleteFavoriteCat(id) {
    console.log('id: ', id);
    // const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    //     method: 'DELETE',
    //     headers: {
    //         'X-API-KEY': API_KEY
    //     }
    // });
    // const data = await res.json();

    const {data, status} = await API.delete(`/favourites/${id}`)


    if (status !== 200) {
        spanError.innerHTML = `There was an error deleting the cat: ${status} ${data.message}`
    } else {
        console.log('Cat deleted from favorites');
        loadFavoriteCats();
    }
}

async function uploadCatPhoto() {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    // const res = await fetch(API_URL_UPLOAD, {
    //     method: 'POST',
    //     headers: {
    //         'X-API-KEY': API_KEY,
    //         // 'Content-Type': 'multipart/formdata'
    //     },
    //     body: formData,
    // });

    // const data = await res.json();

    const {data, status} = await API.post('/images/upload', {
        formData,
    });

    if (status !== 201) {
        spanError.innerHTML = `There was an error uploading the cat: ${status} ${data.message}`
    }
    else {
        console.log("Cat photo uploaded :)");
        console.log({ data });
        console.log(data.url);
        saveFavoriteCat(data.id) // Saves your image to favorites
    }

}

loadRandomCats();
loadFavoriteCats();
