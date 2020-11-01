const axios = require('axios');

const url = 'https://api.github.com/users/mapbox'

// function get_movie_details(title , year)
// {
//     return new Promise(function (resolve, reject) { 
//         axios.get('https://www.omdbapi.com/?t='+title+'&y='+year+'+&apikey=314c21fc')
//         .then(response => {
//         //   console.log(response.data);
//         // console.log(response.data.explanation);
//             return (response.data);
//         })
//         .catch(error => {
//         // console.log(error);
//             reject(error);
//         });
//     }
// }


function makeGetRequest(path) { 
    return new Promise(function (resolve, reject) { 
        axios.get(path).then( 
            (response) => { 
                var result = response.data; 
                console.log('Processing Request'); 
                resolve(result); 
            }, 
                (error) => { 
                reject(error); 
            } 
        ); 
    }); 
} 
  
async function main(title , year) { 
    var result = await makeGetRequest(url); 
    console.log(result.result); 
    console.log('Statement 2'); 
} 

var title = 'Guardians of the Galaxy Vol. 2';
var year = 2017;
// // movie = get_movie_details(title, year);
// // console.log(movie);
main(title , year);

function get_movie()
{
    
    const url = 'https://api.github.com/users/mapbox'
    
    // return axios.get(url).then(response => response.data)
    var strr = [];
        axios.get(url)
       .then(function(response){
               strr.push(response.data);
            //    console.log(strr)
        })


        .catch(function(error){
               console.log(error);
           });
        // console.log(strr)
        return strr;

    const promise = axios.get(url)

    // using .then, create a new promise which extracts the data
    const dataPromise = promise.then((response) => response.data)

    // return it
    return dataPromise
}
movie = get_movie();
console.log(movie)
// get_movie()
//     .then(data => {
//         response.json({ message: 'Request received!', data })
//     })
//     .catch(err => console.log(err))

// movie = get_movie(); 

// console.log(movie)