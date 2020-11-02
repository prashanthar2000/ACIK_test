const Product = require('../database/models').Product
// const get_movie_details = require('../routes/api_call')

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


    const url = 'https://www.omdbapi.com/?t=' + title + '&y=' + year + '+&apikey=314c21fc'
    // console.log(url)
    try {

        const movie_detials = await makeApiCall(url)
        movie = JSON.parse(movie_detials)
        // console.log(movie)
        return movie

    } catch (error) {
        console.error(error);
        return "internal server error"
        // console.error(error);
    }
}

function check_auth(req_headers )
{
    if('x-auth' in req_headers){
       
        if(req_headers["x-auth"] == "tst-seller" )
        {
            return true;
        }
    }
    return false
}
module.exports = {
    create(req, res) {
        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }
        // console.log('fetching data');
        let title = req.body.movieTitle;
        let year = req.body.releaseYear;

        getMovieDetails(title, year).then(data => {

            if (data.Response == "True") {
                //change lenght to text , plot to text , cast to text , 
                Product.create({
                    movieTitle: data.Title,
                    releaseYear: data.Year,
                    lenght: data.Runtime,
                    director: data.Director,
                    plot: data.Plot,
                    Cast: data.Actors,
                    IMBD_rating: data.imdbRating,
                    language: data.Language,
                    genre: data.Genre,
                    Is_sellabe: 1,
                    Inventory : 0, 
                    Sold_unit_count: 0
                })
                .then(movie => {
                    return res.send({
                        'err': false,
                        'data': {
                            "movieTitle": movie.movieTitle,
                            "releaseYear": movie.releaseYear, 
                            "length": movie.lenght, 
                            "director": movie.director, 
                            "plot": movie.plot, 
                            "cast": movie.Cast, 
                            "imdb": movie.IMBD_rating, 
                            "language": movie.language,
                            "genre": movie.genre,
                            "productId": movie.id
                        }, "message": "Product has been created successfully"
                    })

                })
                .catch(error => {
                    console.log(error)
                    error = { 'err': true, 'data': {}, 'message': "Product couldn't not be created" };
                    res.send(error);
                });
            //  
            }
            else
            {
                error = { 'err': true, 'data': {}, 'message': data.Error };
                res.send(error);
            }
    // res.send(data)
        });
        
    },

    sell(req , res){
        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }

        err = { err: true , message:'internal server error'} 
        // console.log(req.body)
        return Product.findByPk(req.body.productId).then(movie => {
            if (!movie) 
            {
                err = { err: true , message:'Product not found' }
                // console.log('no movie')
                return res.send(err);    
            };
            success = {err : false , message:'Product price & inventory be saved successfully'}
            return movie.update({
                SellingPrice : req.body.sellingPrice , 
                Inventory : req.body.inventory, 
                MRP : req.body.mrp , 
                ShippingFee : req.body.shippingPrice, 
                
            }).then(( )  => res.status(200).send(success))
            .catch(() => res.send(err));
            
        }).catch(() => res.send(err));    
    },
    
    unsell(req , res){

        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }

        err = {err : true , message : "Internal server error"}
        return Product.findByPk(req.body.productId).then(movie =>{
            if(!movie)
            {
                err = {err : true , message : "Product not found"}
                return res.send(err);
            };
            success = {err : true , message : "Product has been marked unsellable successfully"}
            return movie.update({
                Is_sellabe:0
            }).then(() => res.status(200).send(success))
            .catch(() => res.send(err));
        }).catch(() => res.send(err));

    }, 
    
    delete(req , res ){

        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }

        err = {err : true , message : "Internal server error"}
        // console.log(req)
        success = {err : true , message : "The product has been deleted successfully"}
        return Product.findByPk(req.params.productId).then(movie =>{
            if(!movie){
                return res.status(200).send(success);        
            }
            return movie
                .destory()
                .then(( ) => res.send(success))
                .catch(() => res.send(err))

        }).catch(() => res.send(err))
        
    }, 

    sellable(req, res){

        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }


        err = {err : true , message : "Internal server error"};
        return Product.findAll({
            where: {
                Is_sellabe : 1
            }
        }).then(movies => {
            // console.log(movies[0].movieTitle);
            data = []
            for(let i = 0 ; i < movies.length ; i++){
                // console.log("incide for")
                movie = {
                    movieTitle : movies[i].movieTitle, 
                    releaseYear : movies[i].releaseYear, 
                    length : movies[i].lenght, 
                    director : movies[i].director, 
                    plot : movies[i].plot,
                    cast : movies[i].Cast, 
                    imbd : movies[i].IMBD_rating, 
                    language : movies[i].language, 
                    genre : movies[i].genre, 
                    productId : movies[i].id, 
                    sellingPrice : movies[i].SellingPrice,
                    inventory : movies[i].Inventory, 
                    soldUnitCount : movies[i].Sold_unit_count, 
                    mrp : movies[i].MRP, 
                    shippingPrice : movies[i].ShippingFee
                }
                // console.log(movie)
                data[i] = movie;
                // console.log(data);
            }
            success = {err : false , data:data , message: "Listed all sellable products succesfully"}
            return res.status(200).send(success);
            // success = {err = false, 
                        // data =  data, 
                        // message: ​"Listed all sellable products successfully"  }
        }).catch(() => res.send(err));

    
    }, 
    
    out_of_stock(req , res){

        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }


        err = {err : true , message : "Internal server error"};
        return Product.findAll({
            where :{
                Is_sellabe : 1,  
                Inventory:0
            }
        }).then(movies => {
            data = []
            for(let i = 0 ; i < movies.length ; i++){
                // console.log("incide for")
                movie = {
                    movieTitle : movies[i].movieTitle, 
                    releaseYear : movies[i].releaseYear, 
                    length : movies[i].lenght, 
                    director : movies[i].director, 
                    plot : movies[i].plot,
                    cast : movies[i].Cast, 
                    imbd : movies[i].IMBD_rating, 
                    language : movies[i].language, 
                    genre : movies[i].genre, 
                    productId : movies[i].id, 
                    sellingPrice : movies[i].SellingPrice,
                    inventory : movies[i].Inventory, 
                    soldUnitCount : movies[i].Sold_unit_count, 
                    mrp : movies[i].MRP, 
                    shippingPrice : movies[i].ShippingFee
                }
                // console.log(movie)
                data[i] = movie;
                // console.log(data);
            }
            success = {err : false , data:data , message: "Listed all sellable products succesfully"}
            return res.status(200).send(success);
            
            // console.log(movies)
        }).catch(() => res.send(err));

    }, 

    top_n_sold(req, res){

        err = {err : true , message: "user not authorized"};
        if(!check_auth(req.headers))
        {
            return res.send(err);
        }


        err = {err : true , message : "Internal server error"};
        n = req.params.count;
        Product.findAll({
             
            order:[["Sold_unit_count", "DESC"]  ],
            limit:n
            // order: '`Products`.`Sold_unit_count` DESC'
            
        }).then(movies => {
            // console.log(movies);
            data = []
            for(let i = 0 ; i < movies.length ; i++){
                // console.log("incide for")
                movie = {
                    movieTitle : movies[i].movieTitle, 
                    releaseYear : movies[i].releaseYear, 
                    length : movies[i].lenght, 
                    director : movies[i].director, 
                    plot : movies[i].plot,
                    cast : movies[i].Cast, 
                    imbd : movies[i].IMBD_rating, 
                    language : movies[i].language, 
                    genre : movies[i].genre, 
                    productId : movies[i].id, 
                    sellingPrice : movies[i].SellingPrice,
                    inventory : movies[i].Inventory, 
                    soldUnitCount : movies[i].Sold_unit_count, 
                    mrp : movies[i].MRP, 
                    shippingPrice : movies[i].ShippingFee
                }
                // console.log(movie)
                data[i] = movie;
                // console.log(data);
            }
            success = {err : false , data:data , message: "Listed all sellable products succesfully"}
            res.status(200).send(success);
            
            // console.log(movies)
        }).catch((errer) => res.send(err));

    }

};

