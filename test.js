var fs = require('fs');
var path = require('path');
var dirpath='/sdf';
var template_data={};
template_data['path']=dirpath;
if (dirpath!=='/') {
    template_data['last_path']=path.dirname(dirpath);
}
var stat=fs.lstatSync('./'+path.join('public',dirpath));
if(stat.isDirectory())
{
    var files=fs.readdirSync('./'+path.join('public',dirpath));
    template_data['items']=[];
    files.forEach(function(file){
        item={};
        item['file_name']=file;
        var file_stat=fs.lstatSync('./'+path.join('public',dirpath,file));
        item['file_type']=file_stat.isDirectory()?'dir':'file';
        item['file_sort']=(file_stat.isDirectory()?'1':'2')+file;
        item['file_path']=path.join(dirpath,file);
        item['file_icon']='moz-icon://'+path.extname(file)+'?size=16';
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
    console.log(template_data);
}else if(stat.isFile()){
    console.log('is file');
}
