const express = require("express");
const expressHbs = require('express-handlebars');
const app = express();
const bodyParser = require("body-parser");
const { authUser, authAdmin } = require('./basicAuth')
const mongoose = require("mongoose");
const uri = 'mongodb+srv://hauncph23182:KDCmBivkwk8nWTJI@mydatabase.inj6nec.mongodb.net/Asignment?retryWrites=true&w=majority'
// const login = require('./login');
const userModel = require('./model/user');
const productModel = require('./model/product');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.engine('.hbs', expressHbs.engine({
  extname: "hbs",
  defaultLayout: 'login',
  layoutsDir: "views/layouts/"
}));


app.set('view engine', '.hbs');
app.set('views', './views');
app.listen(8000, () => {
  console.log("Listening on port 8000");
});
// trang đăng nhập
app.get('/', (req, res) => {
  res.render('home', {
    layout: 'login',
  })
})
app.get('/login', (req, res) => {

  res.render('home', {
    layout: 'login',
    //showContentMaytinh: false,

    helpers: {
      foo() { return 'foo. CP17305 - server Android'; }
    }
  });
});

//trang đăng ký
app.get('/signin', (req, res) => {
  res.render('home', {
    layout: 'signin',

  })
})
//trang sản phẩm

app.get('/product', async (req, res) => {
  await mongoose.connect(uri).then(console.log('ket noi db thanh cong'));
  if(emailcheck){
  
    let products = await productModel.find({}).lean();
    for (let i =0; i<products.length; i++) {
      products[i].order = i + 1;
    }
    // chuyển đổi sang kiểu plain JavaScript object
    res.render('home', {
      layout: 'product',
      products: products,
      image: image,
      fullname: fullname,
      userId: userId,

      // không cần gọi phương thức .map() nữa
    });
  }else{
      return res.send('ban chua dang nhap');
    }
  });



//trang listUser
app.get('/listUser', async (req, res) => {

  await mongoose.connect(uri);
  if (role === 1) {
    let users = await userModel.find({}).lean();
    for (let i =0; i<users.length; i++) {
      users[i].order = i + 1;
    }
    // chuyển đổi sang kiểu plain JavaScript object
    res.render('home', {
      layout: 'listUser',
      users: users,
      image: image,
      fullname: fullname,

      // không cần gọi phương thức .map() nữa
    });
  } else {
    return res.send('ban khong co quyen truy cap')
  }
  // console.log(users);
});

//trang update user
app.get('/edit/:id', async (req, res) => {
  
  await mongoose.connect(uri).then(console.log('ket noi db thanh cong'));
  const id = req.params.id;
  userModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `can not update user with id ${id}. maybe user not found` });
      } else {
        if(role === 1){
          res.render('home', {
            layout: 'updateUser',
            viewTitle: 'Update User',
            data: data.toJSON(),
            _image: image,
            _fullname: fullname,
          });
        }else{
          res.render('home', {
            layout: 'updateUserForUser',
            viewTitle: 'Update User',
            data: data.toJSON(),
            _image: image,
            _fullname: fullname,
          });
        }
        console.log(data);
      }
    });
  
});
//post deer update user
app.post('/updateUser', (req, res) => {
  userModel.findOneAndUpdate({ _id: req.body.id }, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        console.log(`${data} not found`);
        res.render('home', {
          layout: 'updateUser',
          viewTitle: 'Update False',
          
        });
      } else {
        res.redirect('/listUser')
      }
    })
    .catch(err => {
      res.send('Da ton tai email nay trong database');
    })
  console.log(req.body.id);
});

//post deer update user
app.post('/updateUserForUser', (req, res) => {
  userModel.findOneAndUpdate({ _id: req.body.id }, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        console.log(`${data} not found`);
        res.render('home', {
          layout: 'updateUserForUser',
          viewTitle: 'Update False',
          
        });
      } else {
        res.redirect('/product')
      }
    })
    .catch(err => {
      res.send('Da ton tai email nay trong database');
    })
  console.log(req.body.id);
});
//delete user
app.get('/delete/:id', async (req, res) => {
  if(role === 1){
  await mongoose.connect(uri).then(console.log('ket noi db thanh cong'));
  const id = req.params.id;
  userModel.findByIdAndDelete(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `cannot delete user with id ${id}. maybe user not found` });
      } else {
        res.redirect('/listUser');
        console.log(data);

      }
    });
  }else{
    res.send('ban khong phai la admin');
  }
})
//trang thêm sản phẩm
app.get('/addProduct', (req, res) => {
  if(role === 1){
    res.render('home',
    {
      layout: 'addProduct',
      _fullname: fullname,
      _image: image,
      role: role
    });
  }else{
    res.send('ban khong phai admin');
    res.redirect('/');
  }

});

var image, fullname, role, emailcheck, userId;
//su kien login
app.post('/login', async (req, res) => {

  await mongoose.connect(uri).then(console.log("ket noi db thanh cong"));
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;

  userModel.findOne({ email: email, password: password })
    .then(data => {
      if (data) {
        res.redirect('/product');
        image = data.image;
        fullname = data.fullname;
        role = data.role;
        emailcheck = data.email;
        userId = data._id;
        console.log('image: ', image, 'fullname: ', fullname, 'role: ', role);
      } else {
        res.json('email or password khong dung');
      }
    })
    .catch(err => {
      res.json('co loi cau database');
    })
})



//sự kiện signin
app.post('/signin', async (req, res) => {
  await mongoose.connect(uri).then(console.log('ket noi db thanh cong'));
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;
  const fullname = req.body.fullname;
  const image = req.body.image;
  const role = req.body.role;

  userModel.findOne({ email: email })
    .then(data => {
      if (data) {
        res.json('email da ton tai')
      } else {
        return userModel.create({
          email: email,
          password: password,
          fullname: fullname,
          image: image,
          role: role
        });
      }
    })
    .then(data => {
      res.redirect('/');
    })
    .catch(err => {
      res.json('tao tai khoan that bai')
    })
});


//su kien add product
app.post('/addProduct', async (req, res) => {
  await mongoose.connect(uri).then(console.log('ket noi db thanh cong'));
  if (role === 1) {
    const masp = req.body.masp;
    const namePro = req.body.namePro;
    const price = req.body.price;
    const imagePro = req.body.imagePro;
    const colorPro = req.body.colorPro;

    productModel.create({ masp: masp, namePro: namePro, price: price, imagePro: imagePro, colorPro: colorPro })
      .then(data => {
        res.redirect('/product');
      })
      .catch(err => {
        res.json('them san pham that bai');
      });
  } else {
    return res.send('ban khong phai la admin')
  }

});
//
app.post('/updateProduct', (req, res) => {
  productModel.findOneAndUpdate({ _id: req.body.id }, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        console.log(`${data} not found`);
        res.render('home', {
          layout: 'updateProduct',
          viewTitle: 'Update False'
        });
      } else {
        res.redirect('/product')
      }
    })
    .catch(err => {
      res.send(err.message);
    })
  console.log(req.body.idPro);

})
//update product
app.get('/editPro/:id', (req, res) => {
  if(role === 1){
  const id = req.params.id;
  productModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `cannot update user with id ${id}. maybe user not found` });
      } else {
        res.render('home', {
          layout: 'updateProduct',
          viewTitle: "Update Product",
          data: data.toJSON(),
          _image: image,
          _fullname: fullname,
        })
        console.log(data);
      }
    })
  }
  else{
    res.send('ban khong phai la admin');
  }
});
app.get('/deletePro/:id', async (req, res) => {
  if(role === 1){
  await mongoose.connect(uri).then(console.log('ket noi db thanh cong'));
  const id = req.params.id;
  productModel.findByIdAndDelete(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `cannot delete user with id ${id}. maybe user not found` });
      } else {
        res.redirect('/product');
        console.log(data);
      }
    });
  }else{
    res.send('ban khong phai la admin');
  }
})
