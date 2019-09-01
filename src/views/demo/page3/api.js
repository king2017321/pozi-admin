import request from '@/plugin/axios';
let basurl=process.env.NODE_ENV=="development"?'/wx':"https://api.weixin.qq.com"
export const getToken=()=>{
    return request({
        url:'${basurl}/cgi-bin/token?grant_type=client_credential&appid=wx77b72750d6dd14e5&secret=f3139fb838c3bb76ed05758b5e2e294e'
    })
}
export const getUser=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=user`,
        method:'POST',
        data:{}
    })
}
export const getProductList=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=productList`,
        method:'POST',
        data:{}
    })
}
export const getProduct=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=product`,
        method:'POST',
        data:{}
    })
}
export const getTrade=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=trade`,
        method:'POST',
        data:{}
    })
}
export const addTrade=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addTrade`,
        method:'POST',
        data
    })
}
export const deleteTrade=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=deleteAndBack`,
        method:'POST',
        data:{
            id:data.id
        }
    })
}
