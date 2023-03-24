const express = require("express");
const expressHbs = require('express-handlebars');
const app = express();
const bodyParser = require("body-parser");
// const login = require('./login');

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
var image, fullname;
app.get('/product', (req, res) => {

  res.render('home',
    {
      layout: 'product',
      arrPro: arrProduct,
      image: image,
      fullname: fullname
    });

});
//trang listUser
app.get('/listUser', (req, res) => {
  res.render('home',
    {
      layout: 'listUser',
      arr: arrUser,
      _fullname: fullname,
      _image: image,
    });

});
//trang thêm sản phẩm

app.get('/addProduct', (req, res) => {
  res.render('home',
    {
      layout: 'addProduct',
      _fullname: fullname,
      _image: image,
    });

});

//tạo mảng user
let arrUser = new Array();
arrUser.push({ id: 1, email: 'nguyenhau123@gmail.com', password: 123, fullname: 'Nguyen Hau', image: 'https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg' },
  { id: 2, email: 'nguyenhau8209@gmail.com', password: 123, fullname: 'Hau Nguyen', image: 'https://haycafe.vn/wp-content/uploads/2021/11/hinh-anh-hoat-hinh-de-thuong-cute-dep-nhat.jpg' });

//su kien login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  console.log(req.body);
  console.log(arrUser);
  let check;
  for (let i = 0; i < arrUser.length; i++) {
    const element = arrUser[i];
    if (!email || !password) {
      check = 'chua nhap du thong tin'
    } else if (email != element.email || password != element.password) {
      check = 'ban da nhap sai email hoac pass';
    } else if (!emailRegex.test(email)) {
      check = 'Vui long nhap dung dinh dang email';
    } else {
      res.redirect('/product')
      image = element.image;
      fullname = element.fullname;
      console.log(fullname);
      return;
    }

  }
  res.render('home', {
    layout: 'login',
    check: check
  });
})
//sự kiện signin
app.post('/signin', (req, res) => {
  const { email, password, fullname, image } = req.body;
  var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let objUser = { email: email, password: password, fullname: fullname, image: image };
  console.log(req.body)
  let check;

  if (!email || !password || !fullname || !image) {
    check = 'Vui long nhap du thong tin';
    console.log(email);
  } else if (!emailRegex.test(email)) {
    check = 'Vui long nhap dung dinh dang email';
  } else {
    arrUser.push(objUser);
    // res.json('dang ky thanh cong');
    res.redirect('/');
    console.log(arrUser);
    return;
  }
  res.render('home', {
    layout: 'signin',
    check: check
  })
})

//tạo mảng product
let arrProduct = new Array();
arrProduct.push({masp: 'QA1', namePro: 'Quần bò', price: 1000, imagePro: '', colorPro: 'black'})
//su kien add product
app.post('/addProduct', (req, res) =>{
  const {masp, namePro, price, imagePro, colorPro} = req.body;

  let objProduct = {masp : masp, namePro: namePro, price: price, imagePro: imagePro, colorPro: colorPro};
  console.log(req.body);
  let check;
  if(!masp || !namePro || !price) {
    check = 'Vui long nhập đủ thong tin yeu cau';
  }else {
    arrProduct.push(objProduct);
    res.redirect('/product')
    console.log(arrProduct);
    return;
  }
  res.render('home', {
    layout: 'addProduct',
    check: check,
  })
})
