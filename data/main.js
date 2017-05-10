/**
 * Created by Administrator on 2017/5/10.
 */
exports.data = function(){
    return [
        {
            route: "/index",
            handle: function(res,req,next){
                res.writeHead(200,{
                    "content-type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                });
                var data = {
                    "name": "zhangsan",
                    "age": "18"
                };
                res.write(JSON.stringify(data));
                res.end();
            }
        }
    ]
};