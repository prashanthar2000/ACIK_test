
const request = require('request');

// wrap a request in an promise
function makeApiCall(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

async function getMovieDetails(title, year) {
    
    
    const url = 'https://www.omdbapi.com/?t='+title+'&y='+year+'+&apikey=314c21fc'
    console.log(url)
    try {

        const movie_detials = await get_movie(url)
        movie = JSON.parse(movie_detials)
        // console.log(movie)
        return movie

    } catch (error) {
        console.error('ERROR:');
        return 'error'
        // console.error(error);
    }
}

module.export = {
    getMovieDetails,
}