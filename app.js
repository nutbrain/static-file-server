var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var template = require('art-template');
//basedir???????????????????????
var basedir='public';
//???????????????????????????server.on('request',callback)??
server = http.createServer(function(req,res){
    //decodeURI????????????%????????
    var dirpath = decodeURI(url.parse(req.url).pathname);
    var template_data={};
    template_data['path']=dirpath;
    //?????????????????????????????????
    if (dirpath!=='/') {
        template_data['last_path']=path.dirname(dirpath);
    }
    //??????????????????????????????????????iconpdf.icon?????
    if (dirpath.startsWith('/icon') && path.extname(dirpath)==='.icon') {
        f=fs.readFile('./'+path.join('index_template_files',dirpath),function(err,data){
            res.writeHead(200,{'Content-Type': mime.getType(dirpath)});
            res.end(data);
        });
    } else {
        try{
            var stat=fs.lstatSync('./'+path.join(basedir,dirpath));
            if (stat.isDirectory()) {
                var files=fs.readdirSync('./'+path.join(basedir,dirpath));
                template_data['items']=[];
                files.forEach(function(file){
                    item={};
                    item['file_name']=file;
                    var file_stat=fs.lstatSync('./'+path.join(basedir,dirpath,file));
                    item['file_type']=file_stat.isDirectory()?'dir':'file';
                    item['file_sort']=(file_stat.isDirectory()?'1':'2')+file;
                    item['file_path']=path.join(dirpath,file);
                    item['file_path']=path.join(dirpath,file);
                    item['file_icon']='icon'+path.extname(file).substr(1)+'.icon';
                    
                    item['size_sort']=file_stat.size;
                    var logsize=Math.log2(file_stat.size);
                    if (logsize<10) {
                        item['size_value']=file_stat.size.toString()+'B';
                    } else if (logsize<20) {
                        item['size_value']=(file_stat.size/1024).toString()+'KB';
                    } else if (logsize<30) {
                        item['size_value']=(file_stat.size/1024/1024).toString()+'MB';
                    } else if (logsize<40) {
                        item['size_value']=(file_stat.size/1024/1024/1024).toString()+'GB';
                    } else {
                        item['size_value']=(file_stat.size/1024/1024/1024/1024).toString()+'TB';
                    }
                    item['time_sort']=file_stat.mtimeMs;
                    item['time_date']=file_stat.mtime.toDateString();
                    item['time_time']=file_stat.mtime.toTimeString();
                    template_data['items'].push(item);
                });
                html=template(path.resolve('index_template.html'),template_data);
                res.end(html);
            } else {
                f=fs.readFile('./'+path.join(basedir,dirpath),function(err,data){
                    res.writeHead(200,{'Content-Type': mime.getType(dirpath)});
                    res.end(data);
                });
            }
        }
        catch(e){
            res.end(e.toString());
        }
    }
    
}).listen(80,function(req,res) {
    console.log('start');
});
