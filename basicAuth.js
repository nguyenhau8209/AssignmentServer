function authUser (req, res, next){
    console.log(req.user);
    if(req.user == null){
        res.status(401);
        return res.send('You need to sign in first');
    }
    next();
}

function authAdmin(role){
    return (req, res, next) =>{
        if(role == 0){
            res.status(401);
            return res.send('You need to be an admin');
        }
        next();
    }
}
module.exports = {
    
    authUser,
    authAdmin
};