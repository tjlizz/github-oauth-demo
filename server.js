const Koa = require('koa');
const app = new Koa();
const path = require('path');
const fs = require('fs');
const route = require('koa-route');
const serve = require('koa-static');
const axios = require('axios');
const clientID = '4012c84f24f86366ebe0';
const client_secret = '8734098bd097055c723f0c12ceed1bfeb235e2e2';
const main = serve(path.join(__dirname + '/public'));

const redirect = ctx => {
    ctx.response.redirect('/welcome.html');
    ctx.response.body = '<a href="/welcome.html">Index Page</a>';
};

const oauth = async ctx => {
    let requestToken = ctx.request.query.code;
    const tockenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${client_secret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }

    })
    const accessToken = tockenResponse.data.access_token;
    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
        }
    });
    console.log(result.data)
    ctx.cookies.set(
        'cid',
        result.data.id)
    ctx.response.redirect('/welcome.html');


}
app.use(main)
app.use(route.get('/redirect', oauth));
app.listen(3000);