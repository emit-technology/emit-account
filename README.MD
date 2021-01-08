## command line
```

use sero;

var tables = ["outs","balance","balanceRecords","txInfo","addressTx","blockNum","events"];

for(var i=0;i<tables.length;i++){
    db.createCollection(tables[i]);
};

[
    {index:{root:1},unique:true},
    {index:{address:1},unique:false},
    {index:{txHash:1},unique:false},
    {index:{num:1},unique:false},
    {index:{used:1},unique:false}
].forEach((v)=>{
    db.outs.createIndex(v.index,{unique:v.unique});
});

[
    {index:{address:1},unique:false},
    {index:{txHash:1},unique:false},
    {index:{currency:1},unique:false},
    {index:{address:1,currency:1},unique:false}
].forEach((v)=>{
     db.addressTx.createIndex(v.index,{unique:v.unique});
 });

[
    {index:{address:1,currency:1},unique:true},
    {index:{address:1},unique:false},
    {index:{currency:1},unique:false}
].forEach((v)=>{
      db.balance.createIndex(v.index,{unique:v.unique});
  });

[
    {index:{currency:1},unique:false},
    {index:{txHash:1},unique:false},
    {index:{timestamp:-1},unique:false},
    {index:{type:1},unique:false},
    {index:{num:1},unique:false}
    {index:{address:1},unique:false},
].forEach((v)=>{
   db.balanceRecords.createIndex(v.index,{unique:v.unique});
});

[
    {index:{txHash:1},unique:false},
    {index:{fromAddress:1},unique:false},
    {index:{timestamp:-1},unique:false},
    {index:{contractAddress:1},unique:false}
].forEach((v)=>{
    db.txInfo.createIndex(v.index,{unique:v.unique});
 });

[
    {index:{txHash:1},unique:false},
    {index:{topic:1},unique:false},
    {index:{num:-1},unique:false},
    {index:{"event.depositNonce":1},unique:false},
    {index:{contractAddress:1},unique:false}

].forEach((v)=>{
    db.events.createIndex(v.index,{unique:v.unique});
 });



========================================================================
========================================================================
========================================================================
========================================================================


use eth;

var tables = ["balance","balanceRecords","txInfo","addressTx","blockNum","versions","events"];

for(var i=0;i<tables.length;i++){
    db.createCollection(tables[i]);
};

[
    {index:{address:1},unique:false},
    {index:{txHash:1},unique:false},
    {index:{currency:1},unique:false},
    {index:{address:1,currency:1},unique:false}
].forEach((v)=>{
     db.addressTx.createIndex(v.index,{unique:v.unique});
 });

[
    {index:{address:1,currency:1},unique:true},
    {index:{address:1},unique:false},
    {index:{currency:1},unique:false}
].forEach((v)=>{
      db.balance.createIndex(v.index,{unique:v.unique});
  });

[
    {index:{currency:1},unique:false},
    {index:{txHash:1},unique:false},
    {index:{timestamp:-1},unique:false},
    {index:{type:1},unique:false},
    {index:{num:1},unique:false},
    {index:{address:1},unique:false},
].forEach((v)=>{
   db.balanceRecords.createIndex(v.index,{unique:v.unique});
});


[
    {index:{txHash:1},unique:true},
    {index:{fromAddress:1},unique:false},
    {index:{timestamp:-1},unique:false},
    {index:{contractAddress:1},unique:false}
].forEach((v)=>{
    db.txInfo.createIndex(v.index,{unique:v.unique});
 });

[
    {index:{num:1},unique:false},
    {index:{version:1},unique:false}
].forEach((v)=>{
    db.versions.createIndex(v.index,{unique:v.unique});
 });


[
    {index:{txHash:1},unique:false},
    {index:{topic:1},unique:false},
    {index:{num:-1},unique:false},
    {index:{"event.depositNonce":1},unique:false},
    {index:{contractAddress:1},unique:false}

].forEach((v)=>{
    db.events.createIndex(v.index,{unique:v.unique});
 });


```