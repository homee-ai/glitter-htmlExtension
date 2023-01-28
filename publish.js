var exec = require('child_process').exec;

let command=[
    "git add --all",
    `git commit -m ${new Date().getTime()}`,
    `git push -u origin main`,
    `sam28520`
]
async function start(){
    for (const a of command){
     await new Promise((resolve, reject)=>{
         exec(a,
             function (error, stdout, stderr) {
                 console.log('stdout: ' + stdout);
                 console.log('stderr: ' + stderr);
                 if(stderr.indexOf('Enter')!==-1){
console.log('needEnter')
                 }
                 if (error !== null) {
                     console.log('exec error: ' + error);
                     resolve(false)
                 }else{
                     resolve(true)
                 }
             });
     })
    }
}
start()

