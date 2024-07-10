import app from './server';
//Const
app.listen(app.get('port'), () => {
    console.log(`Server running in port "http://localhost/${app.get('port')}"`);
});
