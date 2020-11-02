const Product = require('../database/models').Product
const { Op } = require("sequelize");


// 


module.exports = {

    place_order(req, res){
        err = {err : true , message: "user not authorized"};
        
        if('x-auth' in req.headers){
            // console.log(req.headers)
            if(req.headers["x-auth"] != "tst-customer" )
            {
                return res.send(err);
            }
        }
        else{
            return res.send(err);
        }
        
        err = { err: true , message:'Internal server error '}; 
        
        data = [];
        count = 0;
        cost = 0;
        try{
            for(var key in req.body) {
                data[count] = {id:key};
                ++count;
            }
            console.log(data);
            return Product.findAll({
                where: {
                  [Op.or]:data  
                }
              }).then(movies => {
                // console.log(movies);
                for(var i  = 0 ; i < movies.length ; ++i)
                {
                    if(!movies[i])
                    {
                        err = {err : true , data : { } , message : "productId " + i + " not found"}
                        return res.send(err)
                    }
                    // console.log(movies[i].Inventory , req.body[movies])
                    if(movies[i].Inventory < req.body[movies[i].id])
                    {
                        err = {err : true , data : { } , message : "not enough products in the stock right now"};
                        // err = {err: ​false​,data: {},message: ​"not enough products in the stock right now"}
                        
                        return res.send(err);
                    }
                }
                //no errors found we can continue with transaction now
                for(var i  = 0 ; i < movies.length ; ++i)
                { 
                    
                    cost += movies[i].SellingPrice + movies[i].ShippingFee;
                    let inventory  = movies[i].Inventory - req.body[movies[i].id];
                    let sold_count = movies[i].Sold_unit_count + req.body[movies[i].id];
                    
                    movies[i].update({
                        Sold_unit_count:sold_count, 
                        Inventory : inventory
                    }).then(() => console.log("product placed"))
                    .catch(() => console.log("catastrophic error charged but product not placed"));
                    //use of pub/sub can avoid this kind of errors
                }
                succes = {err : false  , data : {cost : cost} , message : "Order has been placed successfully"}
                return res.status(200).send(succes);
              }).catch(error => {
                    console.log(error)  
                    res.send(err) 
                });
            }
            catch(error){
                console.log(error)
            }   
        
    }
}