
function check(){
    username = localStorage.getItem('username');
    if(!username || !/^[0-9a-zA-Z_]{3,12}$/.test(username)){
        $('#menu > div > a').addClass('disabled');
        $('#showLeft').addClass('disabled');
    }
    console.log('fix');
}
check();