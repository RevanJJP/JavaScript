var express = require('express');
var router = express.Router();
const fs = require("fs")

var name=__dirname+'/shared_files';
var dir1=name+"/dir1"
var dir2=name+"/dir2"

function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}

function copyFile(src, dest) {
  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}

/* GET home page. */
router.get('/files/dir1', function(req, res, next) {
  var array = []
  var files_dir1 = getFiles(dir1);
  
  for(i in files_dir1) {
    var file_name=files_dir1[i].split('\\').pop().split('/').pop();
    array.push({"dir": "dir1", "path": files_dir1[i], "file": file_name});
  }

  res.json(array);
});

router.get('/files/dir2', function(req, res, next) {
  var array = []
  var files_dir2 = getFiles(dir2);

  for(i in files_dir2) {
    var file_name=files_dir2[i].split('\\').pop().split('/').pop();
    array.push({"dir": "dir2", "path": files_dir2[i], "file": file_name});
  }

  res.json(array);
});

router.post('/copy', function(req, res, next) {
  var path = req.body.path;
  if(path.includes('/dir1/')==true) {
    var des_path = path.replace("/dir1/", "/dir2/")
  }
  else {
     var des_path = path.replace("/dir2/", "/dir1/")}
  console.log(des_path);
  copyFile(path, des_path);
  res.redirect("http://localhost:3000")
});

router.post('/delete', function(req, res, next) {
  var path = req.body.path;
  console.log(path);
  fs.unlink(path,function(err){
    if(err) return console.log(err);
    console.log('file deleted successfully');
}); 
  res.redirect("http://localhost:3000")
});

router.post('/rename', function(req, res, next) {
  var path = req.body.path;
  console.log(req.body.path);
  console.log("Nazwa");
  console.log(req.body.name.title);
  if(path.includes('/dir1/')==true) {
    fs.rename(path, dir1+'/'+req.body.name.title, function(err) {
      if ( err ) console.log('ERROR: ' + err);
  });
  }
  else {
    fs.rename(path, dir2+'/'+req.body.name.title, function(err) {
      if ( err ) console.log('ERROR: ' + err);
  });
  }
  res.redirect("http://localhost:3000")
});

module.exports = router;


// <p className="App-intro">
//           <ul>
//             {this.state.users.map(user=> 
//             <li key={user.id}>{files.username}</li>)} 
//           </ul>
//         </p>