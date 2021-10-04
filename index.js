import express from 'express';
const pool = require('./db')
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/reviews?:product_id', (req, res) => {
  var product_id = req.query.product_id;
  var page = req.query.page || 0;
  var count = req.query.count || 5;
  //async/await--->works
  // var results = await pool.query('select * from reviews where product_id = $1 Limit $2',[product_id, count]).then(
  //  (data)=>{return data.rows}
  // );
  // for(var i =0 ; i< results.length; i++){
  //   var photos = await pool.query('select photos.id, photos.url from photos where review_id =$1',[results[i].review_id]).then((data)=>{
  //     return data.rows
  //   })
  //   results[i].photos = photos;
  // }
  // res.json({
  //       'product': product_id,
  //       "page": page,
  //       "count": count,
  //       'results':results,
  //     })

    pool.query('select * from reviews where product_id = $1 and reported=false Limit $2',[product_id, count]).then(
     (data)=>{
       var results = data.rows.map(review=>{
          return pool.query('select photos.id, photos.url from photos where review_id =$1',[review.review_id]).then(photo=>{
            return photo.rows
          })
       })
       Promise.all(results).then(photo => {
         var output = []
         for(var i =0; i< data.rows.length; i++){
            output.push({
              "review_id": data.rows[i].review_id,
              "rating": data.rows[i].rating,
              "summary": data.rows[i].summary,
              "recommend": data.rows[i].recommend,
              "response":data.rows[i].response,
              "body":data.rows[i].body,
              "date":new Date(Number(data.rows[i].date)),
              "reviewer_name":data.rows[i].reviewer_name,
              "helpfulness": data.rows[i].helpfulness,
              "photos": photo[i]
            })
         }
         return output
       })
       .then((data)=>{
          res.json({
            'product': product_id,
            "page": page,
            "count": count,
            'results':data,
          })
       })
     }
    );
})
  app.get('/reviews/meta?:product_id', (req, res) => {
    var product_id = req.query.product_id;
    pool.query(`select reviews.recommend, reviews.rating from reviews where product_id = ${product_id}`, async (err, data)=>{
      var rate = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
      }
      var recommended = {
        "false": 0,
        "true": 0
      }
      var characteristics = {}
      var chara = {}
      data.rows.map((review)=>{
       rate[review.rating] += 1;
       recommended[review.recommend] += 1
      })
      for (var key in rate){
        rate[key] = rate[key].toString();
      }
      for (var key in recommended){
        recommended[key] = recommended[key].toString();
      }
      await pool.query('select id, names from characteristic where product_id = $1',[product_id]).then( async data=>{

        for (var i=0;i< data.rows.length;i++ ){
          var id = 0;
          var averageValue = 0
          await pool.query('select characteristic_id,value from characteristic_reivews where characteristic_id = $1',[data.rows[i].id]).then(data=>{
                var value = 0;
                for (var i =0;i< data.rows.length;i++){
                  value += data.rows[i].value
                }
                id = data.rows[0].characteristic_id
                averageValue= (value/data.rows.length).toString();
              })
          characteristics[data.rows[i].names] = {};
          characteristics[data.rows[i].names]['id'] = id;
          characteristics[data.rows[i].names]['value'] = averageValue;
        }
      })
      res.status(200).send({
        'product_id': product_id,
        "ratings": rate,
        "recommended": recommended,
        'characteristics': characteristics,
      })
    });
  });
  app.post('/reviews',(req,res)=>{
    var product_id = req.body.product_id;
    var rating= req.body.rating;
    var date = String(new Date().getTime());
    var summary = req.body.summary;
    var body = req.body.body;
    var recommend = req.body.recommend;
    var reported = false;
    var reviewer_name = req.body.name;
    var reviewer_email = req.body.email;
    var response = 'null';
    var helpfulness = 0;
    var photos = req.body.photos;
    var characteristics = req.body.characteristics
    //insert into reviews
    pool.query('insert into reviews(product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING review_id',[product_id, rating, date, summary, body, recommend, reported,reviewer_name, reviewer_email, response, helpfulness]).then(data=>{
      var review_id = data.rows[0].review_id
      //insert into photos
      if (photos.length>=1){
        photos.map(photo=>{
          pool.query('insert into photos(review_id, url) values ($1,$2)', [review_id, photo.url]).then(()=>{console.log('photo inserted')}).catch(()=>{console.log('insert failed')})
        })
      } else {
        console.log('no photo added')
      }
      //insert into characteristics
      if (Object.keys(characteristics).length !== 0){
        for (var key in characteristics){
          var characteristic_id = Number(key);
          var value = characteristics[key];
          pool.query('insert into characteristic_reivews(characteristic_id, review_id, value) values ($1,$2,$3)', [characteristic_id, review_id, value]).then(()=>{console.log('characteristics inserted')})
        }
       } else {
        console.log('no characteristics added')
        }
    }).then(()=>{
      res.status(201).send('inserted')
    })
  })

  app.put('/reviews/:review_id/helpful', (req,res)=>{
    var helpfulReviewId = req.params.review_id;
    pool.query('select helpfulness from reviews where review_id = $1',[helpfulReviewId]).then(data=>{
      var newhelpful = data.rows[0].helpfulness+1;
      pool.query('update reviews SET helpfulness = $1 WHERE review_id = $2',[newhelpful,helpfulReviewId])
    })
    res.status(204).send('update completed')
  })

  app.put('/reviews/:review_id/report', (req,res)=>{
    var reportReviewId = req.params.review_id;
    pool.query('select reported from reviews where review_id = $1',[reportReviewId]).then(data=>{
      var newReport = true ;
      pool.query('update reviews SET reported = $1 WHERE review_id = $2',[newReport,reportReviewId])
    })
    res.status(204).send('report submited')
  })


const port = 3000;
app.listen(port, () => {
  console.log('App is now running at port ', port)
})