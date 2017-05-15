/**
 * Created by Administrator on 2017/5/15.
 */
exports.data = function(){
    return [
        {
            route: "/search",
            handle: function(res,req,next){
                res.writeHead(200,{
                    "content-type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                });
                var data = [
                    {
                        id: 12314,
                        name: 'iphone2',
                        price: '$2388'
                    },
                    {
                        id: 23682,
                        name: 'iphone1',
                        price: '$1388'
                    },
                    {
                        id: 35668,
                        name: 'iphone7',
                        price: '$5888'
                    },
                    {
                        id: 85637,
                        name: 'iphone5',
                        price: '$3688'
                    },
                    {
                        id: 56399,
                        name: 'iphone6',
                        price: '$5988'
                    }
                ];
                res.write(JSON.stringify(data));
                res.end();
            }
        }
    ]
};