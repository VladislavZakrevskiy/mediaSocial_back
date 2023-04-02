const ApiError = require("../exceptions/apiError")


module.exports = function (allPosts, limit, page) {
    let countPages = Math.ceil(allPosts.length/limit)
        if(limit < 0 ){
            return allPosts 
        }
        if(page > countPages){
            return allPosts 
        }
    let postList = [] 
        for(let i=0;i < countPages;i++){
            let arr = []
            for(let j=0;j<limit;j++){
                arr.push(allPosts[0])
                allPosts.splice(0,1)
                }
            postList.push(arr)
        }
    let ans = postList[page-1].filter(el => typeof(el) == 'object')
    return ans
}