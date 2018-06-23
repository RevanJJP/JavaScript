const express = require('express');
const MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID; // we will use this later
const bodyParser= require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var dbase
MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    dbase = database.db('wd');
    if (err) return console.log(err)
    app.listen(3000, () => {
        console.log('app working on 3000')
  })
})

app.post('/oceny/add', (req, res, next) => {

    var mark = {
      student_id: req.body.student_id,
      mark: req.body.mark
    };

    dbase.collection('mark').save(mark, (err, result) => {
      if(err) {
        console.log(err);
      }

      res.send('Mark added successfully');
    });
  });

app.get('/', (req, res) => {
    res.send("Yep it's working");
});


app.get('/oceny', (req, res) => {
    dbase.collection('mark').find().toArray( (err, results) => {
        res.send(results)
    });
});

app.get('/name/:id', (req, res, next) => {

    let id = ObjectID(req.params.id);
    dbase.collection('mark').find(id).toArray( (err, result) => {
      if(err) {
        throw err;
      }

      res.send(result);
    });
 });

 app.get('/student/marks/:id', (req, res, next) => {
  //let id = ObjectID(req.params.id);
  dbase.collection('mark').find({student_id: req.params.id}).toArray( (err, result) => {
    if(err) {
      throw err;
    }
    //console.log(result.find("mark"))
    res.render('student.ejs', {mark: result});
  });
});

app.get('/teacher/marks/:id', (req, res, next) => {
  //let id = ObjectID(req.params.id);
  dbase.collection('mark').find({teacher_id: req.params.id}).toArray( (err, result) => {
    if(err) {
      throw err;
    }
    //console.log(result.find("mark"))
    res.render('teacher.ejs', {mark: result});
  });
});

app.get('/teacher/menu', (req, res) => {
  res.sendFile(__dirname+'/menu.html')
})

app.post('/teacher/add', (req, res, next) => {
  var mark = {
    student_id: req.body.student_id,
    teacher_id: req.body.teacher_id,
    mark: req.body.mark
  };
  dbase.collection('mark').save(mark, (err, result) => {
    if(err) {
      console.log(err);
    }
    res.redirect('/teacher/marks/' + req.body.teacher_id);
  });
})

app.get('/teacher/delete', (req, res, next) => {
  dbase.collection('mark').findOneAndDelete({teacher_id: req.query.teacher_id, student_id: req.query.student_id, mark: req.query.mark},
    (err, result) => {
      if (err) return res.send(500, err)
    })
  res.redirect('/teacher/marks/' + req.query.teacher_id);
})

app.get('/teacher/put', (req, res, next) => {
  dbase.collection('mark').findOneAndUpdate({teacher_id: req.query.teacher_id, student_id: req.query.student_id, mark: req.query.mark},
    {$set: 
      {
      teacher_id: req.query.teacher_id,
      student_id: req.query.student_id,
      mark: req.query.new_mark
      }
    })
    res.redirect('/teacher/marks/' + req.query.teacher_id);
})