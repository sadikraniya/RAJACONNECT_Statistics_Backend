const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;
app.use(bodyParser.json()); //application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.listen(3000, () => {
    console.log('server running on port : 3000 ...')
})

const url = 'http://217.182.139.190:1361/parse/classes/';

//all users
app.post('/statistics/allusers', async(req, res) => {
    try {
        const users = await axios.get(url + 'users?limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });

        let objectToSend = Object.assign({});
        objectToSend = users.data;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})

//all likes
app.post('/statistics/alllikes', async(req, res) => {
    try {
        const likes = await axios.get(url + 'likes?limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });

        let objectToSend = Object.assign({});
        objectToSend = likes.data;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})

//users created compte per year(done)
app.post('/statistics/usersperyear', async(req, res) => {
    let year = req.body.year;
    console.log(year);
    try {
        var objectToSend = [];
        for(i=1; i<13; i++) {
            let usersPerYear = await axios.get(url + 'users?where={"year": '+ year+', "month": '+ i+' }&limit=0&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            objectToSend.push(usersPerYear.data.count);
        }

        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//total postes
app.post('/statistics/allpostes', async(req, res) => {
    try {
        var objectToSend = Object.assign({});
        let allpostes = await axios.get(url + 'offers?limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        objectToSend = allpostes.data;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//total commentaires 
app.post('/statistics/allcomments', async(req, res) => {
    try {
        var objectToSend = Object.assign({});
        let allcomments = await axios.get(url + 'comments1?limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        objectToSend = allcomments.data;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//post by type 
app.post('/statistics/postetype', async(req, res) => {
    // let objectToSave = Object.assign({});
    let types = ['news', 'Général','sondage', 'promotions','event', 'videotheque','Emploi/Stage', 'boutique_online','cov'];
    try {
        var objectToSend = Object.assign({});
        var offersPerTypes = Object.assign({});
        for(i=0; i< types.length; i++) {
            let offerstype = await axios.get(url + 'offers?where={"type": "'+ types[i]+'" }&limit=0&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            if (i==6){
                types[i]='Emploi_Stage'
            }
            let type = types[i];
            offersPerTypes[type] = offerstype.data.count;
        }
        objectToSend.offersPerTypes = offersPerTypes;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})

//total comments par type
app.post('/statistics/totalcommentsbytype', async(req, res) => {
    let types = ['news', 'Général','sondage', 'promotions','event', 'videotheque','Emploi/Stage', 'boutique_online','cov'];
    try {
        var objectToSend = Object.assign({});
        var offersPerTypes = Object.assign({});
        var commentsPerTypes = Object.assign({});

        for(i=0; i< types.length; i++) {
            let offerstype = await axios.get(url + 'offers?where={"type": "'+ types[i]+'"}&limit=1000000&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            if (i==6){
                types[i]='Emploi_Stage'
            }
            let type = types[i];

            offersPerTypes[type] = offerstype.data.count;
            var commentsPostes= 0;
            for(j=0; j < offersPerTypes[type]; j++) {
                if(offerstype.data.results[j] && offerstype.data.results[j].comments_post != null) {
                    commentsPostes += offerstype.data.results[j].comments_post;
                }
            }
            commentsPerTypes[type]= commentsPostes;
        }
        objectToSend.commentsPerTypes = commentsPerTypes;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//total likes per types
app.post('/statistics/totalikebytype', async(req, res) => {
    let types = ['news', 'Général','sondage', 'promotions','event', 'videotheque','Emploi/Stage', 'boutique_online','cov'];
    try {
        var objectToSend = Object.assign({});
        var offersPerTypes = Object.assign({});
        var likesPerTypes = Object.assign({});

        for(i=0; i< types.length; i++) {
            let offerstype = await axios.get(url + 'offers?where={"type": "'+ types[i]+'"}&limit=1000000&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            if (i==6){
                types[i]='Emploi_Stage'
            }
            let type = types[i];

            offersPerTypes[type] = offerstype.data.count;
            var likesPostes= 0;
            for(j=0; j < offersPerTypes[type]; j++) {
                if(offerstype.data.results[j] && offerstype.data.results[j].likes_post != null) {
                    likesPostes += offerstype.data.results[j].likes_post;
                }
            }
            likesPerTypes[type]= likesPostes;
        }
        objectToSend.likesPerTypes = likesPerTypes;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//total views per type
app.post('/statistics/totaviewbytype', async(req, res) => {
    let types = ['news', 'Général','sondage', 'promotions','event', 'videotheque','Emploi/Stage', 'boutique_online','cov'];
    try {
        var objectToSend = Object.assign({});
        var offersPerTypes = Object.assign({});
        var viewsPerTypes = Object.assign({});

        for(i=0; i< types.length; i++) {
            let offerstype = await axios.get(url + 'offers?where={"type": "'+ types[i]+'"}&limit=1000000&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            if (i==6){
                types[i]='Emploi_Stage'
            }
            let type = types[i];

            offersPerTypes[type] = offerstype.data.count;
            var viewsPostes= 0;
            for(k=0; k < offersPerTypes[type]; k++) {
                if(offerstype.data.results[k] && offerstype.data.results[k].views != null) {
                    viewsPostes += offerstype.data.results[k].views;
                }
            }
            viewsPerTypes[type]= viewsPostes;
        }
        objectToSend.viewsPerTypes = viewsPerTypes;
        console.log(objectToSend)
        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//top users at likes
app.post('/statistics/topuserslikes', async(req, res) => {
    try {
            let likes = await axios.get(url + 'likes?include=author1&limit=300000&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            let count = likes.data.count;
            likes= likes.data.results;
            var totallikes = new Array(count).fill(0);
            var name = Object.assign({});
            var namef= Object.assign({});

            var users = [];
            for(i=0; i<count; i++) {
                for(j=0; j<count; j++) {
                    if(likes[i].author && likes[j].author){
                        if(likes[i].author.objectId === likes[j].author.objectId) {
                            totallikes[i] += 1;
                        }
                
                        if(likes[i].author.familyname) {
                            name[i] = likes[i].author.familyname;
                        }

                        if(likes[i].author.firstname) {
                            namef[i] = likes[i].author.firstname;
                        }
                    }
                }
                users.push({
                    nom : name[i],
                    prenom : namef[i],
                    totallikes : totallikes[i]
                })
            }

            let objectToSend = Object.assign({});
            users = users.sort((a,b) => b.totallikes-a.totallikes);
            function uniqueBy(users, key){
                var seen = {};
                return users.filter(function(item){
                    var k = key(item);
                    return seen.hasOwnProperty(k) ? false : (seen[k]= true);

                })
            }
            b= uniqueBy(users, JSON.stringify)
            objectToSend = b;

            res.status(200).json(objectToSend);
    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
//top users at commentaires
app.post('/statistics/topuserscomm', async(req, res) => {
    try {
            let comments1 = await axios.get(url + 'comments1?include=author1&limit=100000&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            let count = comments1.data.count;
            comments1= comments1.data.results;
            var totalcommentaires = new Array(count).fill(0);
            var name = Object.assign({});
            var namef= Object.assign({});

            var users = [];
            for(i=0; i<count; i++) {
                for(j=0; j<count; j++) {
                    if(comments1[i].author1 && comments1[j].author1){
                        if(comments1[i].author1.objectId === comments1[j].author1.objectId) {
                            totalcommentaires[i] += 1;
                        }
                
                        if(comments1[i].author1.familyname) {
                            name[i] = comments1[i].author1.familyname;
                        }

                        if(comments1[i].author1.firstname) {
                            namef[i] = comments1[i].author1.firstname;
                        }
                    }
                }
                users.push({
                    nom : name[i],
                    prenom : namef[i],
                    totalcommentaires : totalcommentaires[i]
                })
            }

            let objectToSend = Object.assign({});
            users = users.sort((a,b) => b.totalcommentaires-a.totalcommentaires);
            function uniqueBy(users, key){
                var seen = {};
                return users.filter(function(item){
                    var k = key(item);
                    return seen.hasOwnProperty(k) ? false : (seen[k]= true);

                })
            }
            b= uniqueBy(users, JSON.stringify)
            b = b.slice(0,20);
            objectToSend.nom = b.map(element => element.nom + ' '+ element.prenom);
            objectToSend.totalcommentaires = b.map(element => element.totalcommentaires);

            res.status(200).json(objectToSend);
    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})

//top users publications des postes
app.post('/statistics/topusers', async(req, res) => {
    try {
            let offers = await axios.get(url + 'offers?include=author&limit=100000&count=1', {
                headers: {
                    "Content-Type": "application/json",
                    "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
                }
            });
            let count = offers.data.count;
            offers= offers.data.results;
            var postes = new Array(count).fill(0);
            var name = Object.assign({});
            var namef= Object.assign({});

            var users = [];
            for(i=0; i<count; i++) {
                for(j=0; j<count; j++) {
                    if(offers[i].author && offers[j].author){
                        if(offers[i].author.objectId === offers[j].author.objectId) {
                            postes[i] += 1;
                        }
                
                        if(offers[i].author.familyname) {
                            name[i] = offers[i].author.familyname;
                        }

                        if(offers[i].author.firstname) {
                            namef[i] = offers[i].author.firstname;
                        }
                    }
                }
                users.push({
                    nom : name[i],
                    prenom : namef[i],
                    postes : postes[i]
                })
            }
            let objectToSend = Object.assign({});
            users = users.sort((a,b) => b.postes-a.postes);
            function uniqueBy(users, key){
                var seen = {};
                return users.filter(function(item){
                    var k = key(item);
                    return seen.hasOwnProperty(k) ? false : (seen[k]= true);
                })
            }
            b= uniqueBy(users, JSON.stringify)
            b = b.slice(0,20);
            objectToSend.nom = b.map(element => element.nom + ' '+ element.prenom);
            // objectToSend.prenom = b.map(element => element.prenom);
            objectToSend.postes = b.map(element => element.postes);
            res.status(200).json(objectToSend);
    

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})

//users by tranche
app.post('/statistics/usersbytranche', async(req, res) => {
  
    try {
        const usersunder15 = await axios.get(url + 'users?where={"age": {"$lt": "15"} }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        const users15and30 = await axios.get(url + 'users?where={"age": {"$gt": "15", "$lte": "30"} }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        const users30and45 = await axios.get(url + 'users?where={"age": {"$gt": "30", "$lte": "45"} }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        const users45and60 = await axios.get(url + 'users?where={"age": {"$gt": "45", "$lte": "60"} }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        const usersover60 = await axios.get(url + 'userss?where={"age": {"$gt": "60"} }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });

        let objectToSend = Object.assign({});
        objectToSend.usersunder15 = usersunder15.data.count;
        objectToSend.users15and30 = users15and30.data.count;
        objectToSend.users30and45 = users30and45.data.count;
        objectToSend.users45and60 = users45and60.data.count;
        objectToSend.usersover60 = usersover60.data.count;

        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})
// users by sexe 
app.post('/statistics/usersSexe', async(req, res) => {
    try {
        const femmes = await axios.get(url + 'users?where={"sexe": "F" }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        const hommes = await axios.get(url + 'users?where={"sexe": "M"  }&limit=0&count=1', {
            headers: {
                "Content-Type": "application/json",
                "X-Parse-Application-Id": "KvyrzJWZkYWn3gRElZwGoFn2WkC8BVE9"
            }
        });
        let objectToSend = Object.assign({});
        objectToSend.femmes = femmes.data.count;
        objectToSend.hommes = hommes.data.count;

        res.status(200).json(objectToSend);

    } catch (err) {
        res.status(500).json({ message: "Error!!" });
        console.error(err);
    }
})