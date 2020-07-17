
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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');

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'szack4477@gmail.com',
        subject: "Thanks for creating an account",
        text: `Welcome to the app, ${name}. Let me know how you get along!.`
    })
}

module.exports = {
    sendWelcomeEmail
}

// const msg = {
//     to: 'szack4477@gmail.com',
//     from: 'szack4477@gmail.com',
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   }
  

// sgMail.send(msg).catch(error => console.log(error));
