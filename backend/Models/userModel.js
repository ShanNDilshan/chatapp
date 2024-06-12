const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true , unique : true},
    password: {type: String, required: true},
    pic: {type: String, default : "https://e7.pngegg.com/pngimages/348/800/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png"}
},{
    timestamps: true,
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
       return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
} )

const User = mongoose.model("User", userSchema);
module.exports = User;