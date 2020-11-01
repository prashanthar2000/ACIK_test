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
                    res.send({
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

        Product.findByPk(req.body.productId)
        .then(movie => {
            if (!movie) 
            {
                error = { err: true , message:'Product price & inventory couldn\'t be saved successfully'} 
                res.send(error);    
            };

            movie.update({
                SellingPrice : ​req.body.sellingPrice ​, 
                Inventory : ​req.body.inventory ,
                MRP : req.body.mrp ,
                ShippingFee: ​req.body.shippingPrice
                // MRP: DataTypes.DOUBLE,
                // Inventory: DataTypes.INTEGER,
                // SellingPrice: DataTypes.DOUBLE,
                // ShippingFee: DataTypes.DOUBLE,
                // Is_sellabe: DataTypes.INTEGER,
                // Sold_unit_count: DataTypes.INTEGER
            })
            
        })    
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

