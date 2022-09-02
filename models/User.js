const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please Enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 character']
    },
});
// fire a function after doc saved to db
userSchema.post('save', function(doc, next) {
    console.log('New user was created & saved', doc);

    next();
})

//fire a function before saved to db;
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    console.log('user is about to be created & saved', this);
    next();
});

//static method to login User
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect Password');
    }
    throw Error('incorrect Email')
}
const User = mongoose.model('user', userSchema);
module.exports = User;