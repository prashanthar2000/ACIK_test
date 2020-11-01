const request = require('request');

// wrap a request in an promise
function get_movie(url) {
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

// now to program the "usual" way
// all you need to do is use async functions and await
// for functions returning promises
async function myBackEndLogic() {
    
    var title = 'Guardians of the Galaxy Vol. 2';
    var year = 2017;
    const url = 'https://www.omdbapi.com/?t='+title+'&y='+year+'+&apikey=314c21fc'
    try {

        const movie_detials = await get_movie(url)
        movie = JSON.parse(movie_detials)
        return movie

    } catch (error) {
        console.error('ERROR:');
        // console.error(error);
    }
}

// run your async function
movie = await myBackEndLogic();
console.log(movie);