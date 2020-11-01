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
    console.log(url)
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

module.exports = {
    create(req, res) {
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
                    genre: data.Genre
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
        err = { err: true , message:'internal server error'} 
        // console.log(req.body)
        Product.findByPk(req.body.productId).then(movie => {
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
        err = {err : true , message : "Internal server error"}
        Product.findByPk(req.body.productId).then(movie =>{
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
        err = {err : true , message : "Internal server error"}
        // console.log(req)
        success = {err : true , message : "The product has been deleted successfully"}
        Product.findByPk(req.params.productId).then(movie =>{
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
        err = {err : true , message : "Internal server error"}

    }    


    // list(req, res) {
    //   return Course
    //     .findAll({
    //       include: [{
    //         model: Student,
    //         as: 'students'
    //       },{
    //         model: Lecturer,
    //         as: 'lecturer'
    //       }],
    //       order: [
    //         ['createdAt', 'DESC'],
    //         [{ model: Student, as: 'students' }, 'createdAt', 'DESC'],
    //       ],
    //     })
    //     .then((courses) => res.status(200).send(courses))
    //     .catch((error) => { res.status(400).send(error); });
    // },

    // getById(req, res) {
    //   return Course
    //     .findByPk(req.params.id, {
    //       include: [{
    //         model: Course,
    //         as: 'course'
    //       }],
    //     })
    //     .then((course) => {
    //       if (!course) {
    //         return res.status(404).send({
    //           message: 'Course Not Found',
    //         });
    //       }
    //       return res.status(200).send(course);
    //     })
    //     .catch((error) => res.status(400).send(error));
    // },

    // add(req, res) {
    //   return Course
    //     .create({
    //       course_name: req.body.course_name,
    //     })
    //     .then((course) => res.status(201).send(course))
    //     .catch((error) => res.status(400).send(error));
    // },

    // update(req, res) {
    //   return Course
    //     .findByPk(req.params.id, {
    //       include: [{
    //         model: Course,
    //         as: 'course'
    //       }],
    //     })
    //     .then(course => {
    //       if (!course) {
    //         return res.status(404).send({
    //           message: 'Course Not Found',
    //         });
    //       }
    //       return course
    //         .update({
    //           course_name: req.body.course_name || classroom.course_name,
    //         })
    //         .then(() => res.status(200).send(course))
    //         .catch((error) => res.status(400).send(error));
    //     })
    //     .catch((error) => res.status(400).send(error));
    // },

    // delete(req, res) {
    //   return Course
    //     .findByPk(req.params.id)
    //     .then(course => {
    //       if (!course) {
    //         return res.status(400).send({
    //           message: 'Course Not Found',
    //         });
    //       }
    //       return course
    //         .destroy()
    //         .then(() => res.status(204).send())
    //         .catch((error) => res.status(400).send(error));
    //     })
    //     .catch((error) => res.status(400).send(error));
    // },
  };

