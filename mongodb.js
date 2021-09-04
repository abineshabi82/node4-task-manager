const mongodb=require('mongodb');
const mongoClient=mongodb.MongoClient

const connectionURL='mongodb://127.0.0.1:27017'
const dbName='task-manager'

mongoClient.connect(connectionURL,{useNewUrlParser:true},(err,client)=>{
    if(err)
    return console.log('not connected to db',err)

    console.log('connected to db')
    let db=client.db(dbName)

    // db.collection('users').insertOne({
    //     name:'abi',
    //     age:24
    // }).then(res=>console.log(res)).catch(err=>console.log(err))

    // db.collection('tasks').insertMany([
    //     {
    //         description:"task-1",
    //         completed:true
    //     },
    //     {
    //         description:"task-3",
    //         completed:false
    //     },
    //     {
    //         description:"task-3",
    //         completed:true
    //     }
    // ],(err,res)=>{
    //     if(err)
    //     return console.log("not inserted")

    //     console.log(`${res.insertedCount} docs inserted`)
    // })

    // db.collection('tasks').findOne({_id:new mongodb.ObjectId("612e031e92a079ad8efb5e5a")})
    // .then(task=>{
    //     console.log(task)
    // }).catch(err=>console.log(err))
    
    // db.collection('tasks').find({completed:true})
    // .toArray((err,tasks)=>{
    //     if(err)
    //     console.log(err)

    //     console.log(tasks)
    // })

    // db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set:{
    //         completed:true
    //     }
    // }).then(task=>{
    //     console.log(task);
    // }).catch(err=>{
    //     console.log(err);
    // })

    db.collection('tasks').deleteOne({
        _id:mongodb.ObjectId("612e031e92a079ad8efb5e5c")
    }).then(task=>{
        console.log(task);
    }).catch(err=>{
        console.log(err);
    })


})